declare module "uniqolor" {
  interface BaseOptions {
    format?: "rgb" | "hsl" | "hex";
    saturation?: number | number[];
    lightness?: number | number[];
    differencePoint?: number;
    excludeHue?: number[][];
  }

  interface RandomOptions extends BaseOptions {}

  interface Color {
    color: string;
    isLight: boolean;
  }

  interface PaletteOptions extends BaseOptions {}

  interface Uniqolor {
    (value: string | number, options?: BaseOptions): Color;
    random: (options?: RandomOptions) => Color;
    palette: (value: string | number, count?: number, options?: PaletteOptions) => Color[];
  }

  const uniqolor: Uniqolor;
  export = uniqolor;
}
