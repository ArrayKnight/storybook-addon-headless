import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const external = ['react', '@storybook/addon-devkit']
const plugins = [resolve(), commonjs(), typescript()]

export default [
    {
        external,
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        plugins,
    },
    {
        external,
        input: 'src/register.ts',
        output: {
            file: 'dist/register.js',
            format: 'cjs',
        },
        plugins,
    },
]
