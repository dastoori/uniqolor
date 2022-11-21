declare module "uniqolor" {
  interface BaseOptions {
    format?: "rgb" | "hsl" | "hex";
    saturation?: number | number[];
    lightness?: number | number[];
    differencePoint?: number;
  }

  interface RandomOptions extends BaseOptions {
    excludeHue?: number[][];
  }

  interface Color {
    color: string;
    isLight: boolean;
  }

  interface Uniqolor {
    (value: string | number, options?: BaseOptions): Color;
    random: (options?: RandomOptions) => Color;
  }

  const uniqolor: Uniqolor;
  export = uniqolor;
}
