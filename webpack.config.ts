import * as path from 'path'
import { Configuration } from 'webpack'
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin')

const config: Configuration = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.esm.js',
        library: 'bufio',
        libraryTarget: 'var',
        path: path.resolve(__dirname, 'lib'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                module: 'esnext',
                            },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    plugins: [new EsmWebpackPlugin()],
}

export default config
