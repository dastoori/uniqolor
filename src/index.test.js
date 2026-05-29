import uniqolor from './index';

const HEX_PATTERN = /^#[0-9a-f]{6}$/;
const HSL_PATTERN = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;

describe('src/index', () => {
  describe('uniqolor()', () => {
    const commonOptions = {
      format: 'hex',
      saturation: 40,
      lightness: 50,
    };
    const hslPattern = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;

    it('should generate color from text', () => {
      const result = uniqolor('foobar', commonOptions);

      expect(result).toEqual({
        color: '#964db3',
        isLight: false,
      });
    });

    it('should generate color from uuid', () => {
      const result = uniqolor('fac78187-e2ca-4aca-963e-c327cfaa389d', commonOptions);

      expect(result).toEqual({
        color: '#75b34d',
        isLight: true,
      });
    });

    it('should generate color from positive number', () => {
      const result = uniqolor(14, commonOptions);

      expect(result).toEqual({
        color: '#4db35f',
        isLight: true,
      });
    });

    it('should generate color from negative number', () => {
      const result = uniqolor(-184, commonOptions);

      expect(result).toEqual({
        color: '#4d5ab3',
        isLight: false,
      });
    });

    it('should generate RGB color', () => {
      const result = uniqolor('foo', {
        ...commonOptions,
        format: 'rgb',
      });

      expect(result).toEqual({
        color: 'rgb(179, 168, 77)',
        isLight: true,
      });
    });

    it('should generate HSL color', () => {
      const result = uniqolor('foo', {
        ...commonOptions,
        format: 'hsl',
      });

      expect(result).toEqual({
        color: 'hsl(54, 40%, 50%)',
        isLight: true,
      });
    });

    it('should use `saturation` and `lightness` options', () => {
      const pattern = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;
      const options = {
        format: 'hsl',
        saturation: 12,
        lightness: 76,
      };
      const result = uniqolor('foobar', options);

      expect(result.color).toMatch(pattern);
      expect(typeof result.isLight).toBe('boolean');

      const [,, s, l] = pattern.exec(result.color);

      expect(+s).toBe(options.saturation);
      expect(+l).toBe(options.lightness);
    });

    it('should set `isLight` property based on the color brightness', () => {
      const options = {
        format: 'hsl',
        saturation: 40,
        lightness: 20,
      };
      let result = uniqolor('foobar', options);

      expect(result.color).toMatch(hslPattern);
      expect(result.isLight).toBe(false);

      let match = hslPattern.exec(result.color);

      expect(+match[2]).toBe(options.saturation);
      expect(+match[3]).toBe(options.lightness);

      options.lightness = 80;
      result = uniqolor('foobar', options);

      expect(result.isLight).toBe(true);

      match = hslPattern.exec(result.color);

      expect(+match[3]).toBe(options.lightness);
    });

    it('should use `differencePoint` options', () => {
      const result = uniqolor('foobar', {
        saturation: 40,
        lightness: 20,
        differencePoint: 0,
      });

      expect(result.isLight).toBe(true);
    });

    it('should exclude a range of hue', () => {
      const options = {
        ...commonOptions,
        format: 'hsl',
        excludeHue: [[0, 20], [325, 359]],
      };

      for (let i = 0; i <= 1000; i++) {
        const result = uniqolor(`value-${i}`, options);

        expect(result.color).toMatch(hslPattern);

        const [, h] = hslPattern.exec(result.color);

        expect(+h).toBeGreaterThan(20);
        expect(+h).toBeLessThan(325);
      }
    });

    it('should generate the same color for the same value when excluding hue', () => {
      const options = {
        ...commonOptions,
        excludeHue: [[0, 20], [325, 359]],
      };

      expect(uniqolor('foobar', options)).toEqual(uniqolor('foobar', options));
    });
  });

  describe('uniqolor.random()', () => {
    const commonOptions = {
      format: 'hex',
      saturation: 40,
      lightness: 50,
    };

    it('should generate random HEX color', () => {
      const result = uniqolor.random(commonOptions);

      expect(result.color).toMatch(HEX_PATTERN);
      expect(typeof result.isLight).toBe('boolean');
    });

    it('should generate random RGB color', () => {
      const result = uniqolor.random({
        ...commonOptions,
        format: 'rgb',
      });

      expect(result.color).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
      expect(typeof result.isLight).toBe('boolean');
    });

    it('should generate random HSL color', () => {
      const result = uniqolor.random({
        format: 'hsl',
        saturation: 40,
        lightness: 50,
      });

      expect(result.color).toMatch(HSL_PATTERN);
      expect(typeof result.isLight).toBe('boolean');

      const [,, s, l] = HSL_PATTERN.exec(result.color);

      expect(+s).toBe(commonOptions.saturation);
      expect(+l).toBe(commonOptions.lightness);
    });

    it('should exclude a range of hue', () => {
      const options = {
        ...commonOptions,
        format: 'hsl',
        excludeHue: [[0, 20], [325, 359]],
      };

      for (let i = 0; i <= 1000; i++) {
        const result = uniqolor.random(options);

        expect(result.color).toMatch(HSL_PATTERN);

        const [, h] = HSL_PATTERN.exec(result.color);

        expect(+h).toBeGreaterThan(20);
        expect(+h).toBeLessThan(325);
      }
    });
  });

  describe('uniqolor.palette()', () => {
    const commonOptions = {
      format: 'hex',
      saturation: 40,
      lightness: 50,
    };

    it('should default to 5 colors', () => {
      const result = uniqolor.palette('Hello world!', undefined, commonOptions);

      expect(result).toHaveLength(5);
      result.forEach(entry => {
        expect(entry.color).toMatch(HEX_PATTERN);
        expect(typeof entry.isLight).toBe('boolean');
      });
    });

    it('should generate a palette of the requested size', () => {
      [1, 3, 8, 12].forEach(count => {
        const result = uniqolor.palette('foobar', count, commonOptions);

        expect(result).toHaveLength(count);
      });
    });

    it('should coerce non-integer or sub-1 counts to at least 1', () => {
      expect(uniqolor.palette('foobar', 0, commonOptions)).toHaveLength(1);
      expect(uniqolor.palette('foobar', -3, commonOptions)).toHaveLength(1);
      expect(uniqolor.palette('foobar', 4.7, commonOptions)).toHaveLength(4);
    });

    it('should be deterministic for the same input', () => {
      const a = uniqolor.palette('Hello world!', 5, commonOptions);
      const b = uniqolor.palette('Hello world!', 5, commonOptions);

      expect(a).toEqual(b);
    });

    it('should have the first entry match `uniqolor(value)`', () => {
      const palette = uniqolor.palette('foobar', 5, commonOptions);
      const single = uniqolor('foobar', commonOptions);

      expect(palette[0]).toEqual(single);
    });

    it('should produce a known palette for a fixed seed', () => {
      const result = uniqolor.palette('foobar', 3, commonOptions);

      expect(result).toEqual([
        { color: '#964db3', isLight: false },
        { color: '#b3964d', isLight: true },
        { color: '#4db396', isLight: true },
      ]);
    });

    it('should support `format: hsl` and `format: rgb`', () => {
      const hsl = uniqolor.palette('foobar', 4, { ...commonOptions, format: 'hsl' });
      const rgb = uniqolor.palette('foobar', 4, { ...commonOptions, format: 'rgb' });

      hsl.forEach(({ color }) => expect(color).toMatch(HSL_PATTERN));
      rgb.forEach(({ color }) => expect(color).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/));
    });

    it('should keep every entry outside excluded hue ranges', () => {
      const options = {
        ...commonOptions,
        format: 'hsl',
        excludeHue: [[0, 20], [325, 359]],
      };

      for (let i = 0; i <= 100; i++) {
        const palette = uniqolor.palette(`seed-${i}`, 8, options);

        palette.forEach(({ color }) => {
          expect(color).toMatch(HSL_PATTERN);

          const [, h] = HSL_PATTERN.exec(color);

          expect(+h).toBeGreaterThan(20);
          expect(+h).toBeLessThan(325);
        });
      }
    });
  });
});
