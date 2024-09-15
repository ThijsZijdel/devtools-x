import type { Hue, ToSpace } from "./types";

const rawSeparator = ["Comma", "Semicolon", "Space", "New line"];

const cssConverter = (hues: Hue[], toSpace: ToSpace) => `:root { 
${hues
  .map(
    (data) =>
      `/* ${data.name} */
${data.shades
  .map((shade, index) => `--${data.id}-${shade.shade}: ${toSpace(shade.hex)};`)
  .join("\n")}
`
  )
  .join("\n")}}`;

const sassConverter = (hues: Hue[], toSpace: ToSpace) =>
  hues
    .map(
      (data) =>
        `// ${data.name}
${data.shades
  .map((shade, index) => `$${data.id}-${shade.shade}: ${toSpace(shade.hex)};`)
  .join("\n")}
`
    )
    .join("\n");

const scssConverter = (hues: Hue[], toSpace: ToSpace) =>
  hues
    .map(
      (data) =>
        `// ${data.name}
$${data.id}: (
${data.shades
  .map(
    (shade, index) =>
      `\t${shade.shade}: ${toSpace(shade.hex)}${data.shades?.length - 1 === index ? "" : ","}`
  )
  .join("\n")}
);`
    )
    .join("\n");

const jsonConverter = (hues: Hue[], toSpace: ToSpace) =>
  `{${hues
    .map(
      (data) =>
        `\n\t"${data.id}": {
${data.shades
  .map(
    (shade, index) =>
      `\t\t"${shade.shade}": "${toSpace(shade.hex)}"${data.shades?.length - 1 === index ? "" : ","}`
  )
  .join("\n")}
\t}`
    )
    .join(",")}
}`;

const javascriptConverter = (hues: Hue[], toSpace: ToSpace) =>
  hues
    .map(
      (data) =>
        `// ${data.name}
const ${data.id} = {
${data.shades
  .map(
    (shade, index) =>
      `\t${shade.shade}: '${toSpace(shade.hex)}'${data.shades?.length - 1 === index ? "" : ","}`
  )
  .join("\n")}
}`
    )
    .join("\n") +
  `\n\nexport const hues = {
${hues.map((data) => `\t${data.id},`).join("\n")}
}`;

const typeScriptConverter = (hues: Hue[], toSpace: ToSpace) =>
  hues
    .map(
      (data, index) =>
        `${
          index === 0
            ? `export type Hue = {
    [key: number]: string,
}\n`
            : ""
        }
// ${data.name}
const ${data.id}: Hue = {
${data.shades
  .map(
    (shade, index) =>
      `\t${shade.shade}: '${toSpace(shade.hex)}'${data.shades?.length - 1 === index ? "" : ","}`
  )
  .join("\n")}
}`
    )
    .join("\n") +
  `\n\nexport const hues = {
${hues.map((data) => `\t${data.id},`).join("\n")}
}`;

const tailwindConverter = (hues: Hue[], toSpace: ToSpace) =>
  `{
    "colors": {
${hues
  .map(
    (data) => `\t\t"${data.id}": {
${data.shades
  .map(
    (shade, index) =>
      `\t\t\t"${shade.shade}": "${toSpace(shade.hex)}"${data.shades?.length - 1 === index ? "" : ","}`
  )
  .join("\n")}
        }`
  )
  .join(",\n")}
    }
}`;

const tokenConverter = (hues: Hue[], toSpace: ToSpace) =>
  `{
    "palette": {
        "$type": "color",
        "$version": 1,
        "$desc": "Exported from studio.Mosanic",
${hues
  .map(
    (data) =>
      `\t\t"${data.id}": {
${data.shades
  .map(
    (shade, index) =>
      `\t\t\t"${shade.shade}": "${toSpace(shade.hex)}"${data.shades?.length - 1 === index ? "" : ","}`
  )
  .join("\n")}
        }`
  )
  .join(",\n")}
    }
}`;

const yamlConverter = (hues: Hue[], toSpace: ToSpace) => {
  let yamlOutput = "colors:\n";
  hues.forEach((data) => {
    yamlOutput += `\t${data.id}:\n`;
    data.shades.forEach((shade) => {
      yamlOutput += `\t\t${shade.shade}: ${toSpace(shade.hex)}\n`;
    });
  });
  return yamlOutput;
};

const xmlConverter = (hues: Hue[], toSpace: ToSpace) => {
  let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n<colors>\n';
  hues.forEach((data) => {
    xmlOutput += `\t<color name="${data.id}">\n`;
    data.shades.forEach((shade) => {
      xmlOutput += `\t\t<shade name="${shade.shade}">${toSpace(shade.hex)}</shade>\n`;
    });
    xmlOutput += `\t</color>\n`;
  });
  xmlOutput += "</colors>";
  return xmlOutput;
};

// Swift Converter
const swiftConverter = (hues: Hue[], toSpace: ToSpace) => {
  let swiftOutput = "import UIKit\n\n";
  hues.forEach((data) => {
    swiftOutput += `// ${data.name}\n`;
    data.shades.forEach((shade) => {
      swiftOutput += `let ${data.id}${shade.shade} = UIColor(hex: "${toSpace(shade.hex)}")\n`;
    });
    swiftOutput += "\n";
  });
  return swiftOutput;
};

// const kotlinConverter = (hues: Hue[], toSpace: ToSpace) => {
//     let kotlinOutput = "";
//     hues.forEach(data => {
//         data.shades.forEach((shade) => {
//             kotlinOutput += `val ${data.id}${shade.shade} = Color.parseColor("${toSpace(shade.hex)}")\n`;
//         });
//     });
//     return kotlinOutput;
// }

const rawConverter = (
  hues: Hue[],
  toSpace: ToSpace,
  separator?: string,
  header: boolean = false
) => {
  const values = hues
    .map((data) =>
      header
        ? [
            data.id,
            ...data.shades.map((shade, index) => toSpace(shade.hex)),
          ].join(separator)
        : data.shades.map((shade, index) => toSpace(shade.hex)).join(separator)
    )
    .join(separator);
  return header
    ? "id" +
        separator +
        hues[0].shades.map((shade, index) => shade.shade).join(separator) +
        separator +
        values
    : values;
};

const phpConverter = (hues: Hue[], toSpace: ToSpace) => {
  let output = "<?php\n\n$palette = [\n";

  hues.forEach((hue, i) => {
    output += `\t"${hue.id}" => [\n`;
    hue.shades.forEach((shade, j) => {
      output += `\t\t"${shade.shade}" => "${toSpace(shade.hex)}"${j < hue.shades.length - 1 ? "," : ""}\n`;
    });
    output += `\t]${i < hues.length - 1 ? "," : ""}\n`;
  });

  output += "];\n\n?>";

  return output;
};

export {
  cssConverter,
  sassConverter,
  scssConverter,
  jsonConverter,
  javascriptConverter,
  typeScriptConverter,
  tailwindConverter,
  tokenConverter,
  yamlConverter,
  xmlConverter,
  swiftConverter,
  rawConverter,
  phpConverter,
  rawSeparator,
};
