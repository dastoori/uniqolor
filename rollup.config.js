import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const { MINIFY } = process.env;
const extension = MINIFY ? '.min.js' : '.js';
const banner = `/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @author ${pkg.author}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;
const plugins = [
  babel(),
];

if (MINIFY) {
  plugins.push(uglify({
    output: {
      comments: (node, comment) => comment.type === 'comment2' && /@license/i.test(comment.value),
    },
  }));
}

export default {
  name: pkg.name,
  input: 'src/index.js',
  output: {
    name: pkg.name,
    file: `dist/${pkg.name}${extension}`,
    format: 'umd',
    sourcemap: MINIFY,
  },
  banner,
  plugins,
};
