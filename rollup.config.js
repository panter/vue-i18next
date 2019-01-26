const path = require('path');
const pack = require('./package.json');
const replace = require('rollup-plugin-replace');
// const flow = require('rollup-plugin-flow-no-whitespace');
const buble = require('rollup-plugin-buble');
const node = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');

const resolve = _path => path.resolve(__dirname, _path);
const name = 'VueI18next';
const fileName = 'vue-i18next';
const replacePluginOptions = { __VERSION__: `"${pack.version}"` };

const rollupPlugins = () => [
  replace(replacePluginOptions),
  buble({ objectAssign: 'Object.assign' }),
  node(),
  cjs(),
];

const conf = (format, formatName) => ({
  input: 'src/i18n.js',
  plugins: rollupPlugins(),
  external: ['deepmerge'],
  output: {
    file: resolve(`dist/${fileName}${formatName ? `.${formatName}` : ''}.js`),
    format,
    env: 'production',
    name,
  },
});

export default [conf('cjs', 'common'), conf('es', 'esm'), { ...conf('umd'), external: [] }];
