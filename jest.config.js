module.exports = {
    collectCoverageFrom: [
        'src/**/*.[jt]s?(x)',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/examples/*',
        '!src/**/?(*.){stories,styled}.[jt]s?(x)',
    ],
    moduleFileExtensions: [
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx',
        'node',
    ],
    setupFilesAfterEnv: [
        'jest-expect-message',
        'jest-mock-console/dist/setupTestFramework.js',
    ],
    testEnvironment: 'jest-environment-jsdom',
    testURL: 'http://localhost',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.[jt]sx?$'],
}
