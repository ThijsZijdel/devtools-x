type Hue = {
  name: string;
  id: string;
  shades: Shade[];
};

type Shade = {
  hex: string;
  shade: number;
};

type ColorSpace =
  | "HEX"
  | "RGB"
  | "HSL"
  | "HSV"
  | "CMYK"
  | "LCH"
  | "LAB"
  | "XYZ";

type ToSpace = (hex: string) => string;

export type { Hue, Shade, ColorSpace, ToSpace };
