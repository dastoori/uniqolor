/**
 * Generate unique and beautiful colors from any texts or numbers
 * @version v0.8.0
 * @link https://github.com/dastoori/uniqolor#README
 * @author Rasool Dastoori
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.uniqolor = factory());
}(this, (function () { 'use strict';

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var SATURATE_BOUND = [0, 100];
var LIGHTNESS_BOUND = [0, 100];

var pad2 = function pad2(str) {
  return '' + (str.length === 1 ? '0' : '') + str;
};

var clamp = function clamp(num, min, max) {
  return Math.max(Math.min(num, max), min);
};

var random = function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate hashCode
 * @param  {string} str
 * @return {number}
 */
var hashCode = function hashCode(str) {
  var len = str.length;
  var hash = 0;

  for (var i = 0; i < len; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
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
var boundHashCode = function boundHashCode(num, range) {
  if (typeof range === 'number') {
    return range;
  }

  return num % Math.abs(range[1] - range[0]) + range[0];
};

/**
 * Sanitizing the `range`
 * @param  {number|Array} range
 * @param  {Array}        bound
 * @return {number|Array}
 */
var sanitizeRange = function sanitizeRange(range, bound) {
  if (typeof range === 'number') {
    return clamp.apply(undefined, [Math.abs(range)].concat(toConsumableArray(bound)));
  } else if (range.length === 1) {
    return clamp.apply(undefined, [Math.abs(range[0])].concat(toConsumableArray(bound)));
  }

  return [Math.abs(clamp.apply(undefined, [range[0]].concat(toConsumableArray(bound)))), clamp.apply(undefined, [Math.abs(range[1])].concat(toConsumableArray(bound)))];
};

/**
 * @param  {number} p
 * @param  {number} q
 * @param  {number} t
 * @return {number}
 */
var hueToRgb = function hueToRgb(p, q, t) {
  if (t < 0) {
    t += 1;
  } else if (t > 1) {
    t -= 1;
  }

  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  } else if (t < 1 / 2) {
    return q;
  } else if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
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
var hslToRgb = function hslToRgb(h, s, l) {
  var r = void 0;
  var g = void 0;
  var b = void 0;

  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    // achromatic
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Determines whether the RGB color is light or not
 * http://www.w3.org/TR/AERT#color-contrast
 * @param  {number}  r Red
 * @param  {number}  g Green
 * @param  {number}  b Blue
 * @return {boolean}
 */
var rgbIsLight = function rgbIsLight(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000 >= 125;
};

/**
 * Converts an HSL color to string format
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {string}
 */
var hslToString = function hslToString(h, s, l) {
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

/**
 * Converts RGB color to string format
 * @param  {number}  r      Red
 * @param  {number}  g      Green
 * @param  {number}  b      Blue
 * @param  {string}  format Color format
 * @return {string}
 */
var rgbFormat = function rgbFormat(r, g, b, format) {
  switch (format) {
    case 'rgb':
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    case 'hex':
    default:
      return '#' + pad2(r.toString(16)) + pad2(g.toString(16)) + pad2(b.toString(16));
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
var uniqolor = function uniqolor(value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$format = _ref.format,
      format = _ref$format === undefined ? 'hex' : _ref$format,
      _ref$saturateRange = _ref.saturateRange,
      saturateRange = _ref$saturateRange === undefined ? [50, 55] : _ref$saturateRange,
      _ref$lightnessRange = _ref.lightnessRange,
      lightnessRange = _ref$lightnessRange === undefined ? [50, 60] : _ref$lightnessRange;

  var hash = Math.abs(hashCode(String(value)));
  var h = boundHashCode(hash, [0, 360]);
  var s = boundHashCode(hash, sanitizeRange(saturateRange, SATURATE_BOUND));
  var l = boundHashCode(hash, sanitizeRange(lightnessRange, LIGHTNESS_BOUND));

  var _hslToRgb = hslToRgb(h, s, l),
      _hslToRgb2 = slicedToArray(_hslToRgb, 3),
      r = _hslToRgb2[0],
      g = _hslToRgb2[1],
      b = _hslToRgb2[2];

  return {
    color: format === 'hsl' ? hslToString(h, s, l) : rgbFormat(r, g, b, format),
    isLight: rgbIsLight(r, g, b)
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
uniqolor.random = function () {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$format = _ref2.format,
      format = _ref2$format === undefined ? 'hex' : _ref2$format,
      _ref2$saturateRange = _ref2.saturateRange,
      saturateRange = _ref2$saturateRange === undefined ? [50, 55] : _ref2$saturateRange,
      _ref2$lightnessRange = _ref2.lightnessRange,
      lightnessRange = _ref2$lightnessRange === undefined ? [50, 60] : _ref2$lightnessRange;

  saturateRange = sanitizeRange(saturateRange, SATURATE_BOUND);
  lightnessRange = sanitizeRange(lightnessRange, LIGHTNESS_BOUND);

  var h = random(0, 360);
  var s = typeof saturateRange === 'number' ? saturateRange : random.apply(undefined, toConsumableArray(saturateRange));
  var l = typeof lightnessRange === 'number' ? lightnessRange : random.apply(undefined, toConsumableArray(lightnessRange));

  var _hslToRgb3 = hslToRgb(h, s, l),
      _hslToRgb4 = slicedToArray(_hslToRgb3, 3),
      r = _hslToRgb4[0],
      g = _hslToRgb4[1],
      b = _hslToRgb4[2];

  return {
    color: format === 'hsl' ? hslToString(h, s, l) : rgbFormat(r, g, b, format),
    isLight: rgbIsLight(r, g, b)
  };
};

return uniqolor;

})));
