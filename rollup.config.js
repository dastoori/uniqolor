import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const MINIFY = process.env.MINIFY;
const extension = MINIFY ? '.min.js' : '.js';
const banner =
`/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;
const plugins = [
  babel(),
];

if (MINIFY) {
  plugins.push(uglify({
    output: {
      comments: (node, comment) =>
        comment.type === 'comment2' && /@license/i.test(comment.value),
    },
  }));
}

export default {
  moduleName: 'uniqolor',
  entry: 'src/index.js',
  dest: `dist/uniqolor${extension}`,
  sourceMap: MINIFY,

  format: 'umd',
  banner,
  plugins,
};
