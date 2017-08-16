<p align="center">
  <img src="https://user-images.githubusercontent.com/2003143/29374843-1fa78a3e-82c8-11e7-80a3-0786f899749d.png" alt="uniqolor logo" />
</p>
<p align="center">
  <a href="https://travis-ci.org/dastoori/uniqolor"><img src="https://travis-ci.org/dastoori/uniqolor.svg?branch=master" alt="Build status" /></a>
  <a href="https://github.com/dastoori/uniqolor/releases"><img src="https://img.shields.io/github/release/dastoori/uniqolor.svg" alt="GitHub release" /></a>
  <a href="https://www.npmjs.com/package/uniqolor"><img src="https://img.shields.io/npm/dm/uniqolor.svg" alt="npm downloads" /></a>
  <a href="https://raw.githubusercontent.com/dastoori/uniqolor/master/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a></p>
</p>

## Overview

`uniqolor` is a fast and lightweight (~1.5KB gzipped) javascript library for generating unique and beautiful colors from any texts, numbers, UUIDs, or MongoDB ObjectIds.

## Quick start

### Using `npm` or `yarn`

```shell
$ npm install uniqolor

$ yarn add uniqolor
```

ES6 Import:

```javascript
import uniqolor from 'uniqolor';
```

CommonJS (like nodejs, webpack, and browserify):

```javascript
const uniqolor = require('uniqolor');
```

AMD (like RequireJS):

```javascript
define(['uniqolor'], function (uniqolor) {
  // ...
})
```

### Using `<script>`

Include [`uniqolor.js`](https://unpkg.com/uniqolor/dist/uniqolor.js) or [`uniqolor.min.js`](https://unpkg.com/uniqolor/dist/uniqolor.min.js) into your html file:

```html
<script src="https://unpkg.com/uniqolor/dist/uniqolor.min.js" type="text/javascript"></script>
<script type="text/javascript">
  var color = uniqolor('Hello world!');
</script>
```

### Usage

```javascript
/* Generate unique color from texts or numbers */

uniqolor('Hello world!')
// { color: "#5cc653", isLight: true }

uniqolor('bf545d4c-5360-4158-a572-bd3e204185a9', { format: 'rgb' })
// { color: "rgb(128, 191, 64)", isLight: true }

uniqolor(123, {
  saturateRange: [35, 70],
  lightnessRange: 25,
})
// { color: "#621d1e", isLight: false }

/* Generate random color */

uniqolor.random()
// { color: "#644cc8", isLight: false }

uniqolor.random({ format: 'hsl' })
// { color: "hsl(89, 55%, 60%)", isLight: true }

uniqolor.random({
  saturateRange: 80,
  lightnessRange: [70, 80],
})
// { color: "#c7b9da", isLight: true }
```

## API

### uniqolor(value, [options]) ⇒ `Object`

Generate unique color from `value`

**Params:**

- `value` (type: `string|number`)
- `options` (type: `Object`, default: `{}`)
- `options.format` (type: `string`, default: `'hex'`): The color format, it can be one of `hex`, `rgb` or `hsl`
- `options.saturateRange` (type: `number|Array`, default: `[50, 55]`): Determines the color saturate, it can be a number or a range between 0 and 100
- `options.lightnessRange` (type: `number|Array`, default: `[50, 60]`): Determines the color lightness, it can be a number or a range between 0 and 100

**Output:**

- `color` (type: `string`): The generated color
- `isLight` (type: `boolean`): Determines whether the `color` is a light color or a dark color (It's good for choosing a foreground color, like font color)

### uniqolor.random([options]) ⇒ `Object`

Generate random color

Params:

- `options` (type: `Object`, default: `{}`)
- `options.format` (type: `string`, default: `'hex'`): The color format, it can be one of `hex`, `rgb` or `hsl`
- `options.saturateRange` (type: `number|Array`, default: `[50, 55]`): Determines the color saturate, it can be a number or a range between 0 and 100
- `options.lightnessRange` (type: `number|Array`, default: `[50, 60]`): Determines the color lightness, it can be a number or a range between 0 and 100

## Contributing

Your ideas and contributions are welcome; check out our [contributing guide](https://github.com/dastoori/uniqolor/blob/master/CONTRIBUTING.md)

## [License](https://github.com/dastoori/uniqolor/blob/master/LICENSE.md)

The unicorn shape in the logo made by [Freepik](https://www.freepik.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

MIT © 2017 Rasool Dastoori
