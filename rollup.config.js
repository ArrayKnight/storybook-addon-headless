import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
]
const options = {
    clean: true,
    tsconfigOverride: {
        exclude: ['**/__tests__/**', '**/test.tsx', '**/stories.tsx'],
    },
    typescript: require('typescript'),
}
const output = {
    format: 'cjs',
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
                tsconfigOverride: {
                    ...options.tsconfigOverride,
                    compilerOptions: { declaration: false },
                },
            }),
        ],
    },
]
