const SATURATE_BOUND = [0, 100];
const LIGHTNESS_BOUND = [0, 100];

const pad2 = str => `${str.length === 1 ? '0' : ''}${str}`;

const clamp = (num, min, max) => Math.max(Math.min(num, max), min);

const random = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

/**
 * Generate hashCode
 * @param  {string} str
 * @return {number}
 */
const hashCode = str => {
  const len = str.length;
  let hash = 0;

  for (let i = 0; i < len; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
};

/**
* Clamps `num` within the inclusive `range` bounds
* @param  {number}       num
* @param  {number|Array} range
* @return {number}
*/
const boundHashCode = (num, range) => {
  if (typeof range === 'number') {
    return range;
  }

  return (num % Math.abs(range[1] - range[0])) + range[0];
};

/**
 * Sanitizing the `range`
 * @param  {number|Array} range
 * @param  {Array}        bound
 * @return {number|Array}
 */
const sanitizeRange = (range, bound) => {
  if (typeof range === 'number') {
    return clamp(Math.abs(range), ...bound);
  } else if (range.length === 1 || range[0] === range[1]) {
    return clamp(Math.abs(range[0]), ...bound);
  }

  return [
    Math.abs(clamp(range[0], ...bound)),
    clamp(Math.abs(range[1]), ...bound),
  ];
};

/**
 * @param  {number} p
 * @param  {number} q
 * @param  {number} t
 * @return {number}
 */
const hueToRgb = (p, q, t) => {
  if (t < 0) {
    t += 1;
  } else if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + ((q - p) * 6 * t);
  } else if (t < 1 / 2) {
    return q;
  } else if (t < 2 / 3) {
    return p + ((q - p) * ((2 / 3) - t) * 6);
  }

  return p;
};

/**
 * Converts an HSL color to RGB
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {Array}
 */
const hslToRgb = (h, s, l) => {
  let r;
  let g;
  let b;

  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    // achromatic
    r = g = b = l;
  } else {
    const q = l < 0.5
      ? l * (1 + s)
      : (l + s) - (l * s);
    const p = (2 * l) - q;

    r = hueToRgb(p, q, h + (1 / 3));
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - (1 / 3));
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
};

/**
 * Determines whether the RGB color is light or not
 * http://www.w3.org/TR/AERT#color-contrast
 * @param  {number}  r Red
 * @param  {number}  g Green
 * @param  {number}  b Blue
 * @return {boolean}
 */
const rgbIsLight = (r, g, b) => ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 140;

/**
 * Converts an HSL color to string format
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {string}
 */
const hslToString = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/**
 * Converts RGB color to string format
 * @param  {number}  r      Red
 * @param  {number}  g      Green
 * @param  {number}  b      Blue
 * @param  {string}  format Color format
 * @return {string}
 */
const rgbFormat = (r, g, b, format) => {
  switch (format) {
    case 'rgb':
      return `rgb(${r}, ${g}, ${b})`;
    case 'hex':
    default:
      return `#${pad2(r.toString(16))}${pad2(g.toString(16))}${pad2(b.toString(16))}`;
  }
};

/**
 * Generate unique color from `value`
 * @param  {string|number} value
 * @param  {Object}        [options={}]
 * @param  {string}        [options.format='hex']
 *  The color format, it can be one of `hex`, `rgb` or `hsl`
 * @param  {number|Array}  [options.saturateRange=[50, 55]]
 *  Determines the color saturate, it can be a number or a range between 0 and 100
 * @param  {number|Array}  [options.lightnessRange=[50, 60]]
 *  Determines the color lightness, it can be a number or a range between 0 and 100
 * @return {Object}
 * @example
 *
 * uniqolor('Hello world!')
 * // { color: "#5cc653", isLight: true }
 *
 * uniqolor('Hello world!', { format: 'rgb' })
 * // { color: "rgb(92, 198, 83)", isLight: true }
 *
 * uniqolor('Hello world!', {
 *   saturateRange: 30,
 *   lightnessRange: [70, 80],
 * })
 * // { color: "#afd2ac", isLight: true }
 */
const uniqolor = (value, {
  format = 'hex',
  saturateRange = [50, 55],
  lightnessRange = [50, 60],
} = {}) => {
  const hash = Math.abs(hashCode(String(value)));
  const h = boundHashCode(hash, [0, 360]);
  const s = boundHashCode(hash, sanitizeRange(saturateRange, SATURATE_BOUND));
  const l = boundHashCode(hash, sanitizeRange(lightnessRange, LIGHTNESS_BOUND));
  const [r, g, b] = hslToRgb(h, s, l);

  return {
    color: format === 'hsl'
      ? hslToString(h, s, l)
      : rgbFormat(r, g, b, format),
    isLight: rgbIsLight(r, g, b),
  };
};

/**
 * Generate random color
 * @param  {Object}       [options={}]
 * @param  {string}       [options.format='hex']
 *  The color format, it can be one of `hex`, `rgb` or `hsl`
 * @param  {number|Array} [options.saturateRange=[50, 55]]
 *  Determines the color saturate, it can be a number or a range between 0 and 100
 * @param  {number|Array} [options.lightnessRange=[50, 60]]
 *  Determines the color lightness, it can be a number or a range between 0 and 100
 * @return {Object}
 * @example
 *
 * uniqolor.random()
 * // { color: "#644cc8", isLight: false }
 *
 * uniqolor.random({ format: 'rgb' })
 * // { color: "rgb(195, 65, 126)", isLight: false }
 *
 * uniqolor.random({
 *   saturateRange: 30,
 *   lightnessRange: [70, 80],
 * })
 * // { color: "#c7b9da", isLight: true }
 */
uniqolor.random = ({
  format = 'hex',
  saturateRange = [50, 55],
  lightnessRange = [50, 60],
} = {}) => {
  saturateRange = sanitizeRange(saturateRange, SATURATE_BOUND);
  lightnessRange = sanitizeRange(lightnessRange, LIGHTNESS_BOUND);

  const h = random(0, 360);
  const s = typeof saturateRange === 'number'
    ? saturateRange
    : random(...saturateRange);
  const l = typeof lightnessRange === 'number'
    ? lightnessRange
    : random(...lightnessRange);
  const [r, g, b] = hslToRgb(h, s, l);

  return {
    color: format === 'hsl'
      ? hslToString(h, s, l)
      : rgbFormat(r, g, b, format),
    isLight: rgbIsLight(r, g, b),
  };
};

export default uniqolor;

