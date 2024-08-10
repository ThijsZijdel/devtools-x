import {
  Button,
  Group,
  NativeSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { Monaco } from "@/Components/MonacoWrapper";
import { notifications } from "@mantine/notifications";

import Client from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw"; // for inline HTML rendering

const langs = [
  "JavaScript",
  "TypeScript",
  "Rust",
  "Python",
  "C#",
  "Go",
  "Java",
  "C",
  "C++",
  "Text",
  "PHP",
  "JSON",
];

const API_KEY_NAME = "openai-api-key";

function OpenAI() {
  const [codeValue, setCodeValue] = useState(``);

  const [lang, setLang] = useState("JSON");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [apiKey, setApiKey] = useLocalStorage({
    key: API_KEY_NAME,
    defaultValue: "",
  });

  const [description, setDescription] = useState("Example gist");
  const [publicGist, setPublicGist] = useState(false);
  const [filename, setFilename] = useState("paste.txt");

  const createPaste = async () => {
    setLoading(true);
    if (!apiKey) {
      notifications.show({
        message: "Please enter a valid GitHub API key",
        title: "Error",
        color: "red",
      });
      setLoading(false);
      return;
    }

    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${apiKey}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        description: description,
        public: publicGist,
        files: {
          [filename]: {
            content: codeValue,
          },
        },
      }),
    })
      .then((e) => e.json())
      .catch((e) => {
        console.error(e);
        return {};
      });

    setLoading(false);
    setLink(res?.html_url);
  };

  const Step = z.object({
    explanation: z.string(),
    output: z.string(),
  });

  const MathReasoning = z.object({
    steps: z.array(Step),
    final_answer: z.string(),
  });

  const testRes = async () => {
    try {
      const openai = new Client({
        dangerouslyAllowBrowser: true,
        apiKey,
      });

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful math tutor. Guide the user through the solution step by step.",
          },
          { role: "user", content: "how can I solve 8x + 2 = -4" },
        ],
        response_format: zodResponseFormat(MathReasoning, "math_reasoning"),
      });
      const math_reasoning = completion.choices[0].message.parsed;

      setCodeValue(JSON.stringify(math_reasoning ?? completion));
    } catch (e: any) {
      console.error(e);
      notifications.show({
        message: "Error: " + e.message,
        title: "Error",
        color: "red",
      });
    }
  };

  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     { role: "system", content: "You are a helpful assistant." },
  //     { role: "user", content: "What is a LLM?" },
  //   ],
  //   model: "gpt-4o-mini",
  // });
  // const res = completion.choices[0].message.content;

  return (
    <Stack
      h="100%"
      style={{
        overflow: "auto",
      }}
    >
      <Group>
        <NativeSelect
          label="Language"
          value={lang}
          data={langs.map((e) => e.toUpperCase())}
          onChange={(e) => {
            setLang(e.target.value);
          }}
        ></NativeSelect>
        <TextInput
          label="API Key"
          value={apiKey}
          placeholder="Enter OpenAi API key"
          onChange={(e) => {
            setApiKey(e.currentTarget.value);
          }}
        ></TextInput>
      </Group>
      <Monaco
        setValue={(e) => setCodeValue(e || "")}
        value={codeValue}
        language={lang.toLowerCase()}
        height="60%"
        extraOptions={{
          fontSize: 15,
        }}
      />
      <Button loading={loading} onClick={testRes}>
        Send
      </Button>
      {link ? (
        <>
          <Text
            bg="green.8"
            p="xs"
            c="white"
            style={{
              borderRadius: 5,
            }}
          >
            {link}
          </Text>
        </>
      ) : null}

      {(codeValue ? JSON.parse(codeValue ?? "")?.steps : []).map(
        (step, index) => (
          <div key={index}>
            <MarkdownPreview
              source={step.explanation}
              style={{
                backgroundColor: "transparent",
                color: "white",
                // padding: "15px",
                // height: "100%",
                overflow: "scroll",
              }}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            />
            <BlockMath math={step.output} />
          </div>
        )
      )}
    </Stack>
  );
}

export default OpenAI;

// TODO: Add a button to copy the link to clipboard
// TODO: store settings to db
// TODO: store prev generated URLS?
