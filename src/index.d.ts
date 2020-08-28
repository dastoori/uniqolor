declare module "uniqolor" {
  interface Options {
    format?: "rgb" | "hsl" | "hex";
    saturation?: number | number[];
    lightness?: number | number[];
    differencePoint?: number;
  }

  interface Color {
    color: string;
    isLight: boolean;
  }

  interface Uniqolor {
    (value: string | number, options?: Options): Color;
    random: (options?: Options) => Color;
  }

  const uniqolor: Uniqolor;
  export = uniqolor;
}
