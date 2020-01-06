import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

var pkg = require('./package.json');

var banner = '//  Ramda v' + pkg.version + '\n'
  + '//  https://github.com/ramda/ramda\n'
  + '//  (c) 2013-' + new Date().getFullYear() + ' Scott Sauyet, Michael Hurley, and David Chambers,\n'
  + '//  extend with StaticLand-like modules by Matthias Seemann'
  + '//  Ramda may be freely distributed under the MIT license.\n';

const
	config = {
		input: "source/index.js",
		output: [
			{
				file: "dist/ramda.mjs",
				format: "esm",
        banner: banner
			},
      {
				file: "dist/ramda.cjs",
				format: "cjs",
        banner: banner
			},
      {
				file: "dist/ramda.js",
				format: "umd",
        banner: banner,
        name: 'R',
        exports: 'named'
			},
      {
				file: "dist/ramda.min.js",
				format: "umd",
        banner: banner,
        name: 'R',
        exports: 'named'
			}
		],
		plugins: [
			commonjs(),
			resolve({ preferBuiltins: false }),
      terser({
        include: [/^.+\.min\.js$/]
      })
		]
	};

export default config;
