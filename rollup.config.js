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
const output = {
    format: 'esm',
    preferConst: true,
}

export default [
    {
        external,
        input: 'src/index.ts',
        output: {
            ...output,
            file: pkg.main,
        },
        plugins: [typescript(options)],
    },
    {
        external,
        input: 'src/register.tsx',
        output: {
            ...output,
            file: 'dist/register.js',
        },
        plugins: [
            typescript({
                ...options,
                tsconfigOverride: { compilerOptions: { declaration: false } },
            }),
        ],
    },
]
