module.exports = {
    addons: ['@storybook/addon-knobs/register', './dist/register'],
    stories: ['../src/examples/*.stories.tsx'],
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: [['react-app', { flow: false, typescript: true }]],
            },
        })

        config.resolve.extensions.push('.ts', '.tsx')

        return config
    },
}
