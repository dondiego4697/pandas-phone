import * as path from 'path';
import * as webpack from 'webpack';

const localNodeModulesPath = path.resolve(__dirname, 'node_modules');
const clientPath = path.resolve('src/client');

type ConfigKey = 'browser' | 'mobile';
const CONFIG_KEYS: ConfigKey[] = ['browser', 'mobile'];

function getConfig(key: ConfigKey, mode: string): webpack.Configuration {
    const isProduction = mode === 'production';
    return {
        entry: () => path.resolve(clientPath, `./${key}/index.tsx`),
        output: {
            path: path.resolve(__dirname, 'out/src/client'),
            filename: `${key}.bundle.js`
        },
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        target: 'web',
        resolve: {
            alias: {
                client: path.resolve('./src/client')
            },
            modules: [
                clientPath,
                localNodeModulesPath
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        resolveLoader: {
            modules: [localNodeModulesPath],
            extensions: ['.js', '.json'],
            mainFields: ['loader', 'main']
        },
        externals: {},
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'cache-loader'
                        },
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: path.resolve(clientPath, `tsconfig.json`),
                            }
                        }
                    ]
                }
            ]
        }
    };
}

export default (argv) => CONFIG_KEYS.map((key) => getConfig(key, argv.mode));

