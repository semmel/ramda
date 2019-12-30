import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

var pkg = require('./package.json');

var banner = '//  Ramda v' + pkg.version + '\n'
  + '//  https://github.com/ramda/ramda\n'
  + '//  (c) 2013-' + new Date().getFullYear() + ' Scott Sauyet, Michael Hurley, and David Chambers,\n'
  + '//  extend with Static-Land modules by Matthias Seemann'
  + '//  Ramda may be freely distributed under the MIT license.\n';

const
	config = {
		input: "source/index.js",
		output: [
			{
				file: "dist/ramda.mjs",
				format: "esm",
        banner: banner
			}
		],
		plugins: [
			commonjs(),
			resolve({ preferBuiltins: false })
		]
	};

export default config;
