import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
]
const options = {
    clean: true,
    typescript: require('typescript'),
}

export default [
    {
        external,
        input: 'src/index.ts',
        output: {
            file: pkg.main,
            format: 'cjs',
        },
        plugins: [typescript(options)],
    },
    {
        external,
        input: 'src/register.ts',
        output: {
            file: 'dist/register.js',
            format: 'cjs',
        },
        plugins: [
            typescript({
                ...options,
                tsconfigOverride: { compilerOptions: { declaration: false } },
            }),
        ],
    },
]
