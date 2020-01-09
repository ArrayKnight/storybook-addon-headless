import typescript from '@rollup/plugin-typescript'

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        plugins: [typescript()],
    },
    {
        input: 'src/register.ts',
        output: {
            file: 'dist/register.js',
            format: 'cjs',
        },
        plugins: [typescript()],
    },
]
