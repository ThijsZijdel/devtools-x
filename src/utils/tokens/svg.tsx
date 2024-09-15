import { useEffect, useRef, useState } from "react";

import type { Hue, ToSpace } from "./types";
import { roundPrecise } from "@/utils/roundPrecise";

const SvgDisplay = ({
  hues,
  toSpace,
  space,
}: {
  hues: Hue[];
  toSpace: ToSpace;
  space: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const labelWidth = 60;
  const labelHeight = 30;
  const width = 400;

  const cellWidth = (width - labelWidth) / hues[0].shades.length;
  const cellHeight = hues?.length > 6 ? 45 : 55;

  const fontSize = 10;

  const svgHeight = cellHeight * (1 + hues.length) + 2;

  const [svgDataUrl, setSvgDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      setSvgDataUrl(svgUrl);
    }
  }, [hues]);

  const canRender = ["SVG", "RGB", "HSL", "HEX"].includes(space) || !space;

  return (
    <>
      <div className="max-w-full overflow-x-auto relative">
        {!canRender ? (
          <div className="w-full p-2 text-xs flex items-center justify-center text-gray-500">
            This color space is not supported in web preview
          </div>
        ) : (
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={svgHeight}
            viewBox={`0 0 ${width} ${svgHeight}`}
          >
            <g id="labels">
              {hues[0].shades.map((shade, shadeIndex) => (
                <g
                  key={shade.shade}
                  transform={`translate(${labelWidth + cellWidth * shadeIndex}, 0)`}
                  id={`label-${shade.shade}`}
                >
                  <text
                    x={cellWidth / 2.3}
                    y={labelHeight / 2 + fontSize / 3}
                    fill="black"
                    fontSize={fontSize}
                    textAnchor="middle"
                  >
                    {shade.shade}
                  </text>
                </g>
              ))}
            </g>
            {hues.map((color, i) => (
              <g
                key={color.id}
                transform={`translate(0, ${labelHeight + cellHeight * i})`}
                id={color.id}
              >
                {color.name.split(" ").map((namePart, index) => (
                  <text
                    x={0}
                    y={cellHeight / 2}
                    fill="black"
                    fontSize={fontSize}
                    textAnchor="left"
                    id={`name-${color.id}`}
                  >
                    <tspan
                      x={0}
                      dy={index === 0 ? 0 : fontSize * index}
                      textAnchor="left"
                    >
                      {namePart}
                    </tspan>
                  </text>
                ))}

                {color.shades.map((shade, j) => (
                  <rect
                    id={`${color.id}-${shade.shade}`}
                    width={cellWidth}
                    height={cellHeight}
                    fill={toSpace(shade.hex) ?? shade.hex}
                    key={shade.shade}
                    transform={`translate(${roundPrecise(labelWidth + cellWidth * j, 2)}, 0)`}
                  />
                ))}
              </g>
            ))}
          </svg>
        )}
      </div>
      {svgDataUrl && canRender && (
        <a
          href={svgDataUrl}
          download="mosanic-palette.svg"
          className="px-4 py-2 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 text-center text-xs font-semibold duration-300 ease-out hover:text-gray-900"
        >
          Download SVG
        </a>
      )}
    </>
  );
};
