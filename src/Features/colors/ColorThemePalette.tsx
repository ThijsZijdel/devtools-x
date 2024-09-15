import { useMemo, useState } from "react";
import { Button, Checkbox, Flex, Modal, Select, Stack } from "@mantine/core";
import styles from "./ColotThemePalette.module.scss";
import { ColorSpace } from "@/utils/tokens/types";
import { useThemeData } from "@/hooks";
import { exportOptions } from "@/utils/tokens/export";
import { Monaco } from "@/Components/MonacoWrapper";

export const ColorThemePalette = () => {
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState("SVG");
  const [separator, setSeparator] = useState<string>(",");
  const [header, setHeader] = useState<boolean>(false);
  const [space, setSpace] = useState<ColorSpace>("HEX" as ColorSpace);

  const { themeData, updateTheme } = useThemeData();

  const exporter = useMemo(() => {
    return exportOptions.find((option) => option.name === exportType);
  }, [exportType]);

  const colors = Object.entries(themeData?.colors ?? {}).map(
    ([key, value]) => ({
      id: key,
      name: key,
      shades: value,
    })
  );

  // name: string;
  // id: string;
  // shades: Shade[];

  const converted = useMemo(() => {
    if (!exporter) return "";
    return (
      exporter.converter?.(
        colors.map((c) => ({
          ...c,
          shades: c.shades.map((s: string, index: number) => ({
            hex: s,
            shade: index,
          })),
        })),
        (hex: string) => hex,
        separator,
        header
      ) ?? ""
    );
  }, [exporter, colors]);

  // const { addHue, colors, active, updateShades, setActive, getHue } = useColorStore(state => state);

  // useEffect(() => {
  //     setConverted('');
  //     const withHeader = header && separator !== '\n' && separator !== ' ';
  //     setTimeout(() => {
  //         setConverted(converter(hues, toSpace, separator, withHeader));
  //     }, 10);
  // }, [exporter.name, separator, header, space]);

  const downloadPalette = () => {
    if (!exporter) return;
    const blob = new Blob([converted], { type: exporter.format });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mosanicPalette${exporter.append ? exporter.append : ""}.${exporter.file}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!colors?.length) return null;

  return (
    <div className={styles.container}>
      {colors.map((hue) => (
        <div className={styles.hueRow} key={hue.id}>
          {hue.shades?.map((shade: any, index: number) => (
            <div
              key={index}
              onClick={
                () => {}
                // setActive({ ...active, hue: hue.id ?? "", shade: index })
              }
              style={{ backgroundColor: shade }}
              className={`
                ${styles.shadeBox} 
              
               `}
              // ${index === active?.shade && active?.hue === hue.id ? styles.active : ""}
            >
              {index + 1}
            </div>
          ))}
        </div>
      ))}

      <Button
        className={styles.exportButton}
        onClick={() => setExporting(true)}
      >
        Export
      </Button>

      <Modal
        opened={exporting}
        onClose={() => setExporting(false)}
        title="Palette Export"
        size="xl"
      >
        <div className={styles.modalContent}>
          <Flex>
            <Stack>
              <Select
                label="Export methods"
                placeholder="Select export method"
                data={exportOptions.map((option) => ({
                  value: option.name,
                  label: option.name,
                }))}
                value={exportType}
                onChange={(value) => setExportType(value!)}
                className={styles.select}
              />
              <Select
                label="Color format"
                placeholder="Select color format"
                data={
                  [
                    { value: "HEX", label: "HEX" },
                    { value: "RGB", label: "RGB" },
                    { value: "HSL", label: "HSL" },
                  ] as {
                    value: ColorSpace;
                    label: string;
                  }[]
                }
                value={space}
                onChange={(value) => setSpace(value as ColorSpace)}
                className={styles.select}
              />
              {exporter?.name === "Raw" && (
                <div className={styles.separatorOptions}>
                  <Checkbox
                    label="Include header"
                    checked={header}
                    onChange={() => setHeader(!header)}
                    className={styles.checkbox}
                  />
                </div>
              )}
            </Stack>
            <Stack style={{ height: "300", width: "50%" }}>
              {/*<div className="flex flex-col gap-y-2 w-[400px] h-[350px]">*/}
              {!exporter ? null : exporter?.name === "Raw" ? (
                <div
                  className="monospace text-xs overflow-scroll pb-4 text-gray-600"
                  style={{
                    fontFamily:
                      'BerkeleyMono, monospace, Menlo, Monaco, "Courier New"',
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: converted.replace(/\n/g, "<br />"),
                  }}
                />
              ) : exporter?.name === "SVG" ? null : ( // <SvgDisplay hues={hues} toSpace={toSpace} space={space} />
                <Monaco
                  value={converted}
                  language={exporter.extension.toLowerCase()}
                  height={450}
                />
                // <pre>{JSON.stringify(converted, null, 2)}</pre>
              )}
              {/* <CodeEditor value={JSON.stringify(colors, null, 2)} /> */}
              {/*</div>*/}
            </Stack>
          </Flex>

          <Button onClick={downloadPalette} className={styles.downloadButton}>
            Download
          </Button>
        </div>
      </Modal>
    </div>
  );
};
