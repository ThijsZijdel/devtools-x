import { Divider, Group, List, ListItem, Select, Stack } from "@mantine/core";
import { useMemo, useState } from "react";
import { Convert } from "@/utils/colors";
import { clipboard } from "@tauri-apps/api";
import { notifications } from "@mantine/notifications";

const conv = new Convert();

const tags = [
  "Default text",
  "a",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "ul",
  "ol",
  "blockquote",
  "mark",
  "pre",
  "code",
  "button",

  // momentum plan
  "cite", // citation
  "q", // quote
  "dfn", // definition
  "abbr", // abbreviation

  // 'input',    // catalyst plan
  // 'textarea',
  // 'select',
  // 'label',
  // 'span',  inherited
  // 'div',    inherited

  // apex plan
  // 'strong',
  // 'em',
  // 'i',
  // 'b',
  // 'small',
  // 'sub',
  // 'sup',
  // 'del',
  // 'ins',
];

const append = {
  a: "Link",
  p: "Paragraph",
  li: "List item",
  ul: "Unordered list",
  ol: "Ordered list",
  pre: "Preformatted",
  cite: "Citation",
  q: "Quote",
  dfn: "Definition",
  abbr: "Abbreviation",
};

const default_states = [
  { value: "base", label: "Base state" },
  { value: ":hover", label: "Hover" },
  { value: ":not(:hover)", label: "Not hover" },
  { value: ":active", label: "Pressed" },
  { value: ":not(:active)", label: "Not pressed" },
  { value: ":focus", label: "Focused" },
  { value: ":not(:focus)", label: "Not focused" },
  { value: ":focus-within", label: "Focused within" },
  { value: ":not(:focus-within)", label: "Not focused within" },
  { value: ":focus-visible", label: "Focused visible" },
  { value: ":not(:focus-visible)", label: "Not focused visible" },
  { value: ":disabled", label: "Disabled" },
  { value: ":not(:disabled)", label: "Not disabled" },
];

const link_states = [
  { value: ":visited", label: "Visited" },
  { value: ":not(:visited)", label: "Not visited" },
  { value: ":link", label: "Link" },
  { value: ":not(:link)", label: "Not link" },
];

export const FONT_SCALES = [
  { value: 1.067, label: "1.067 - Minor Second" },
  { value: 1.125, label: "1.125 - Major Second" },
  { value: 1.2, label: "1.200 - Minor Third" },
  { value: 1.25, label: "1.250 - Major Third" },
  { value: 1.333, label: "1.333 - Perfect Fourth" },
  { value: 1.414, label: "1.414 - Super Fourth" },
  { value: 1.5, label: "1.500 - Perfect Fifth" },
  { value: 1.618, label: "1.618 - Golden Ratio" },
];

export const DEFAULT_FONTS = [
  {
    //     type: 'title',
    //     heading: true,
    //     text: false,
    //     label: 'Title',
    //     font: 'Open Sans',
    //     scale: 6.5,
    //     size: '16',
    //     metric: 'px',
    //     color: 'shades',
    //     shade: '40',
    //     bold: false,
    //     weight: null,
    //     italic: false,
    //     underline: false,
    //     class:'title',
    //     lorem: 'For super clients.'
    // },{
    type: "h1",
    heading: true,
    label: "Heading 1",
    font: "Open Sans",
    scale: 5,
    size: "16",
    metric: "px",
    lorem: "For power clients.",
  },
  {
    type: "h2",
    heading: true,
    label: "Heading 2",
    font: "Open Sans",
    scale: 4,
    size: "16",
    metric: "px",
    lorem: "For more power clients.",
  },
  {
    type: "h3",
    heading: true,
    label: "Heading 3",
    font: "Open Sans",
    scale: 3,
    size: "16",
    metric: "px",
    lorem: "For more power clients.",
  },
  {
    type: "h4",
    heading: true,
    label: "Heading 4",
    font: "Open Sans",
    scale: 2,
    size: "16",
    metric: "px",
    lorem: "For more power clients.",
  },
  {
    type: "h5",
    heading: true,
    label: "Heading 5",
    font: "Open Sans",
    scale: 1,
    size: "16",
    metric: "px",
    lorem: "For more power clients.",
  },
  {
    type: "h6",
    heading: true,
    label: "Heading 6",
    font: "Open Sans",
    scale: 0,
    size: "16",
    metric: "px",
    lorem: "For more power clients.",
  },
  {
    type: "p",
    text: true,
    label: "Paragraph",
    font: "Open Sans",
    size: "16",
    metric: "px",
    lorem: "Lorem ipsum dolar samit dola.",
  },
  {
    type: "p",
    text: true,
    label: "Small paragraph",
    font: "Open Sans",
    scale: -1,
    size: "16",
    metric: "px",
    class: "small",
    lorem: "Lorem ipsum dolar samit dola.",
  },
  {
    //     type: 'span',
    //     text: true,
    //     heading: false,
    //     label: 'Span tag',
    //     font: 'Open Sans',
    //     scale: 0,
    //     size: '16',
    //     metric: 'px',
    //     color: 'shades',
    //     shade: '40',
    //     bold: false,
    //     weight: null,
    //     italic: false,
    //     underline: false,
    //     lorem: 'Span',
    // },{
    type: "b",
    text: true,
    label: "Bold tag",
    font: "Open Sans",
    scale: 0,
    size: "16",
    metric: "px",
    bold: true,
    lorem: "Bold",
  },
  {
    type: "i",
    text: true,
    label: "Italic tag",
    font: "Open Sans",
    scale: 0,
    size: "16",
    metric: "px",
    italic: true,
    lorem: "Italic",
  },
  {
    type: "u",
    text: true,
    label: "Underline tag",
    font: "Open Sans",
    scale: 0,
    size: "16",
    metric: "px",
    underline: true,
    lorem: "Underline",
  },
  {
    type: "button",
    text: true,
    label: "Button",
    font: "Open Sans",
    scale: -1,
    size: "16",
    metric: "px",
    lorem: "Button text",
  },
  {
    type: "a",
    text: true,
    label: "Link tag",
    font: "Open Sans",
    scale: 0,
    size: "16",
    metric: "px",
    lorem: "Link",
  },
];

const getScaled = (font: any, baseSize: any, fontScale: any) => {
  let index = 0;
  let copy = baseSize;
  while (index < font.scale) {
    copy = (copy * fontScale).toFixed(1);
    index++;
  }
  return copy.toString();
};

const formats = [
  "css",
  "scss",
  "less",
  "sass",
  "stylus",
  "tailwind",
  "js",
  "ts",
];

// getScaled(font, baseSize, fontScale) :
const Typography = () => {
  const [scale, setScale] = useState(1.333);
  const [cssFormat, setCssFormat] = useState("css");

  const fonts = useMemo(() => {
    return DEFAULT_FONTS.map((f) => {
      return {
        ...f,
        size: getScaled(f, f.size, scale),
      };
    });
  }, [scale]);

  const copy = async (font: any) => {
    let css = `${font.type} {`;
    css += `\n\tfont-size: ${font.size}${font.metric};`;
    if (font.bold) css += `\n\tfont-weight: bold;`;
    if (font.italic) css += `\n\tfont-style: italic;`;
    if (font.underline) css += `\n\ttext-decoration: underline;`;
    css += `\n}`;
    await clipboard.writeText(css);
    notifications.show({
      message: `Copied ${font.label} to clipboard`,
      color: "blue",
      autoClose: 1000,
    });
  };

  return (
    <Stack
      align="center"
      px="lg"
      h={"100%"}
      w={"100%"}
      style={{
        overflowY: "auto",
      }}
    >
      <Group align="center">
        <br />
        <Select
          label="Mode"
          data={FONT_SCALES.map(({ value, label }) => ({
            value: value.toString(),
            label: label,
          }))}
          value={scale.toString()}
          allowDeselect={false}
          onChange={(e) => setScale(parseFloat(e as string))}
        />

        <Select
          label="Format"
          data={formats.map((value) => ({
            value,
            label: value,
          }))}
          value={cssFormat}
          allowDeselect={false}
          onChange={(e) => setCssFormat(e as string)}
        />
      </Group>

      <Divider />

      <List
        px="lg"
        h={"100%"}
        w={"100%"}
        style={{
          overflowY: "auto",
        }}
      >
        {fonts.map((font: any) => {
          return (
            <ListItem
              key={font.label}
              style={{
                listStyleType: "none",
              }}
              role="button"
              tabIndex={0}
              onClick={() => copy(font)}
              onKeyDown={(e) => e?.key === "Enter" && copy(font)}
            >
              <p
                style={{
                  fontSize: `${font.size}px`,
                  fontWeight: font.bold ? "bold" : "normal",
                  fontStyle: font.italic ? "italic" : "normal",
                  textDecoration: font.underline ? "underline" : "none",
                  marginBottom: 0,
                }}
              >
                {font.lorem}
              </p>
              {/*<Group align="center">*/}
              {/*  <span>{font.label}</span>*/}
              {/*  <span>{font.size}</span>*/}
              {/*</Group>*/}
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};

export default Typography;
