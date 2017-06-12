import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  moduleName: 'infosites-accounts-client',
  entry: 'src/main.js',
  format: 'umd',
  external: [ 'jwt-decode' ],
  dest: 'dist/infosites-accounts-client.js',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
	uglify()
  ]
};