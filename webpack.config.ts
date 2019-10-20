import * as path from 'path';
import * as webpack from 'webpack';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

const localNodeModulesPath = path.resolve('./node_modules');
const frontPath = path.resolve('./src/front');
const srcPath = path.resolve('./src');

const configs = [
    {
        webpack: {
            entry: () => path.resolve(frontPath, `./admin/index.tsx`),
            output: {
                path: path.resolve('./out/src/front'),
                filename: `admin.bundle.js`
            },
            plugins: [
                new ExtractTextPlugin('admin.bundle.css')
            ]
        },
        tsConfigFileName: path.resolve(frontPath, './admin/tsconfig.json')
    },
    {
        webpack: {
            entry: () => path.resolve(frontPath, `./client/index.tsx`),
            output: {
                path: path.resolve('./out/src/front'),
                filename: `client.bundle.js`
            },
            plugins: [
                new ExtractTextPlugin('client.bundle.css')
            ]
        },
        tsConfigFileName: path.resolve(frontPath, './client/tsconfig.json')
    }
];

const babelPlugins = [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-react-display-name',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', {
        legacy: true
    }],
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-object-rest-spread', {
        useBuiltIns: true
    }],
    ['@babel/plugin-transform-runtime', {
        regenerator: true
    }]
];

const babelOptions = {
    comments: true,
    presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
            modules: 'commonjs',
            loose: true
        }]
    ],
    plugins: babelPlugins
};

function getBaseConfig(isProduction: boolean, tsConfigFileName: string): webpack.Configuration {
    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        target: 'web',
        resolve: {
            alias: {
                client: path.resolve(frontPath, './client'),
                admin: path.resolve(frontPath, './admin'),
                '@denstep-core': path.resolve(frontPath, './@denstep-core'),
                common: path.resolve(srcPath, './common')
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
                        /* {
                            loader: 'cache-loader'
                        }, */
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        },
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: tsConfigFileName
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                }
            ]
        }
    }
}

export default () => configs.map((config) => {
    const isProduction = process.argv.find((x) => x === '--mode=production');

    return {
        ...config.webpack,
        ...getBaseConfig(Boolean(isProduction), config.tsConfigFileName)
    }
});

