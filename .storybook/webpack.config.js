const fs = require('fs')
const path = require('path')
const root = fs.realpathSync(process.cwd())

module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [['react-app', { flow: false, typescript: true }]],
        },
    })

    config.resolve.extensions.push('.ts', '.tsx')

    config.resolve.alias['~'] = path.resolve(root, 'src')

    return config
}
