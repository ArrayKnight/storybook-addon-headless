const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin')

module.exports = {
    addons: ['@storybook/addon-knobs', '../register'],
    stories: ['../src/examples/*.stories.mdx', '../src/examples/*.stories.tsx'],
    webpackFinal: async (config) => {
        config.module.rules.push(
            {
                test: /\.(stories|story)\.mdx$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['@babel/plugin-transform-react-jsx'],
                        },
                    },
                    {
                        loader: '@mdx-js/loader',
                        options: {
                            compilers: [createCompiler({})],
                        },
                    },
                ],
            },
            {
                test: /\.(ts|tsx)$/,
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [['react-app', { flow: false, typescript: true }]],
                },
            },
        )

        config.resolve.extensions.push('.ts', '.tsx')

        return config
    },
}
