import { Group, NativeSelect, Stack } from "@mantine/core";
import YAML from "js-yaml";
import xml2js from "xml-js";
import toml from "@iarna/toml";
import { useState } from "react";
import { Monaco } from "@/Components/MonacoWrapper";
import { csv2json, json2csv } from "json-2-csv";

import { Buffer } from "buffer";

window.Buffer = Buffer;

const DataConverter = () => {
  const [left, setLeft] = useState({
    mode: "json",
    file: '{\n  "numbers": [1, 2, 3]\n}',
  });
  const [right, setRight] = useState({
    mode: "yaml",
    file: `numbers:\n  - 1\n  - 2\n  - 3`,
  });

  const convertData = (input: string, fromMode: string, toMode: string) => {
    try {
      let parsedData;
      switch (fromMode) {
        case "json":
          parsedData = JSON.parse(input);
          break;
        case "yaml":
          parsedData = YAML.load(input);
          break;
        case "csv":
          parsedData = csv2json(input);
          break;
        case "xml":
          parsedData = xml2js.xml2json(input, {
            compact: true,
            alwaysChildren: true,
          });
          break;
        case "toml":
          parsedData = toml.parse(input);
          break;
        default:
          parsedData = input;
      }
      switch (toMode) {
        case "json":
          return JSON.stringify(parsedData, null, 4);
        case "yaml":
          return YAML.dump(parsedData);
        case "csv":
          return json2csv(parsedData);
        case "xml":
          return xml2js.json2xml(JSON.stringify(parsedData), {
            compact: true,
            spaces: 4,
          });
        case "toml":
          return toml.stringify(parsedData);
        default:
          return input;
      }
    } catch (error) {
      return "Error in conversion: " + (error as any)?.message;
    }
  };

  const handleInputChange = (input?: string) => {
    if (!input) {
      setRight({ mode: left.mode, file: "" });
      setLeft({ mode: left.mode, file: "" });
      return;
    }
    const newRightFile = convertData(input, left.mode, right.mode);
    setRight({ ...right, file: newRightFile });
    setLeft({ ...left, file: input });
  };

  const switchMode = (newMode: string, side: string) => {
    if (side === "left") {
      setLeft({ ...left, mode: newMode });
      const newRightFile = convertData(left.file, newMode, right.mode);
      setRight({ ...right, file: newRightFile });
    } else {
      setRight({ ...right, mode: newMode });
      const newRightFile = convertData(left.file, left.mode, newMode);
      setRight({ ...right, file: newRightFile });
    }
  };

  return (
    <Stack style={{ height: "100%" }}>
      <Group>
        <NativeSelect
          data={[
            { value: "json", label: "JSON" },
            { value: "yaml", label: "YAML" },
            { value: "csv", label: "CSV" },
            { value: "xml", label: "XML" },
            { value: "toml", label: "TOML" },
          ]}
          value={left.mode}
          onChange={(e) => switchMode(e.currentTarget.value, "left")}
        />
        <NativeSelect
          data={[
            { value: "json", label: "JSON" },
            { value: "yaml", label: "YAML" },
            { value: "csv", label: "CSV" },
            { value: "xml", label: "XML" },
            { value: "toml", label: "TOML" },
          ]}
          value={right.mode}
          onChange={(e) => switchMode(e.currentTarget.value, "right")}
        />
      </Group>
      <Group wrap="nowrap" style={{ height: "100%", width: "100%" }}>
        <Monaco
          width="50%"
          language={left.mode}
          extraOptions={{ contextmenu: false }}
          value={left.file}
          setValue={(e) => handleInputChange(e)}
        />
        <Monaco
          language={right.mode}
          value={right.file}
          width="50%"
          height="100%"
          extraOptions={{
            readOnly: true,
            contextmenu: false,
          }}
        />
      </Group>
    </Stack>
  );
};

export default DataConverter;
