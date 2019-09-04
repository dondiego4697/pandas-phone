import * as path from 'path';
import * as webpack from 'webpack';

const localNodeModulesPath = path.resolve('./node_modules');
const frontPath = path.resolve('./src/front');

const configs = [
    {
        webpack: {
            entry: () => path.resolve(frontPath, `./admin/index.tsx`),
            output: {
                path: path.resolve('./out/src/front'),
                filename: `admin.bundle.js`
            }
        },
        tsConfigFileName: path.resolve(frontPath, './admin/tsconfig.json')
    },
    {
        webpack: {
            entry: () => path.resolve(frontPath, `./client/mobile/index.tsx`),
            output: {
                path: path.resolve('./out/src/front'),
                filename: `client-mobile.bundle.js`
            }
        },
        tsConfigFileName: path.resolve(frontPath, './client/tsconfig.json')
    },
    {
        webpack: {
            entry: () => path.resolve(frontPath, `./client/browser/index.tsx`),
            output: {
                path: path.resolve('./out/src/front'),
                filename: `client-browser.bundle.js`
            }
        },
        tsConfigFileName: path.resolve(frontPath, './client/tsconfig.json')
    }
];

function getBaseConfig(isProduction: boolean, tsConfigFileName: string): webpack.Configuration {
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        target: 'web',
        resolve: {
            alias: {
                client: path.resolve(frontPath, './client'),
                admin: path.resolve(frontPath, './admin'),
            },
            modules: [
                frontPath,
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
                                configFileName: tsConfigFileName
                            }
                        }
                    ]
                }
            ]
        }
    }
}

export default (argv) => configs.map((config) => {
    const isProduction = argv.mode === 'production';

    return {
        ...config.webpack,
        ...getBaseConfig(isProduction, config.tsConfigFileName)
    }
});

