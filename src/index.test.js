import uniqolor from './index';

describe('src/index', () => {
  describe('uniqolor()', () => {
    const commonOptions = {
      format: 'hex',
      saturateRange: 40,
      lightnessRange: 50,
    };

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

    it('should use `saturateRange` and `lightnessRange` options', () => {
      const pattern = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;
      const options = {
        format: 'hsl',
        saturateRange: 12,
        lightnessRange: 76,
      };
      const result = uniqolor('foobar', options);

      expect(result.color).toMatch(pattern);
      expect(typeof result.isLight).toBe('boolean');

      const [,, s, l] = pattern.exec(result.color);

      expect(+s).toBe(options.saturateRange);
      expect(+l).toBe(options.lightnessRange);
    });

    it('should set `isLight` property based on the color brightness', () => {
      const options = {
        format: 'hsl',
        saturateRange: 40,
        lightnessRange: 20,
      };
      const pattern = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;
      let result = uniqolor('foobar', options);

      expect(result.color).toMatch(pattern);
      expect(result.isLight).toBe(false);

      let match = pattern.exec(result.color);

      expect(+match[2]).toBe(options.saturateRange);
      expect(+match[3]).toBe(options.lightnessRange);

      options.lightnessRange = 80;
      result = uniqolor('foobar', options);

      expect(result.isLight).toBe(true);

      match = pattern.exec(result.color);

      expect(+match[3]).toBe(options.lightnessRange);
    });
  });

  describe('uniqolor.random()', () => {
    const commonOptions = {
      format: 'hex',
      saturateRange: 40,
      lightnessRange: 50,
    };

    it('should generate random HEX color', () => {
      const result = uniqolor.random(commonOptions);

      expect(result.color).toMatch(/^#[0-9a-f]{6}$/);
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
      const pattern = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;
      const result = uniqolor.random({
        format: 'hsl',
        saturateRange: 40,
        lightnessRange: 50,
      });

      expect(result.color).toMatch(pattern);
      expect(typeof result.isLight).toBe('boolean');

      const [,, s, l] = pattern.exec(result.color);

      expect(+s).toBe(commonOptions.saturateRange);
      expect(+l).toBe(commonOptions.lightnessRange);
    });
  });
});
