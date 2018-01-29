import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import virtual from 'rollup-plugin-virtual';

const plugins = [
    nodeResolve({
        main: true
    }),
    babel({
        sourceMap: true,
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
            ['env', {
                modules: false,
                loose: true,
                exclude: ['transform-es2015-typeof-symbol'],
                targets: {
                    browsers: ['last 2 versions', 'IE >= 9']
                }
            }]
        ],
        plugins: ['external-helpers']
    })
];
const iifeConfig = {
    input: 'index.js',
    output: {
        format: 'iife',
        file: 'dist/etch.dev.js',
        name: 'etch',
        sourcemap: true,
        strict: true,
    },
    plugins: [
        virtual({
            'index.js': `
                import etch from './lib/index';
                if (typeof module!='undefined') module.exports = etch;
                else self.etch = etch;
            `
        }),
        ...plugins,
    ],
};
const esmConfig = {
    input: 'lib/index.js',
    output: {
        format: 'es',
        file: 'dist/etch.esm.js',
        name: 'etch',
        sourcemap: true,
        strict: true,
    },
    plugins,
};

export default [iifeConfig, esmConfig];
