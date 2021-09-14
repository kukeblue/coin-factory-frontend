const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ROOT_DIRECTORY = path.join(__dirname)
const SRC_DIRECTORY = path.join(ROOT_DIRECTORY, 'src')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.ts',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: [path.resolve('node_modules'), 'node_modules'],
    },
    target: 'web',
    devtool: 'cheap-source-map',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://uc.sqd8.cn/',
                changeOrigin: true,
                pathRewrite: { '^/api': '/api' },
                onProxyReq: function (proxyReq, req, res) {
                    // 监听代理的返回结果
                    console.log('Cookie:', proxyReq.getHeader('Cookie'))
                },
            },
        },
        disableHostCheck: true,
        contentBase: './dist',
        historyApiFallback: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif)$/,
                // use: [
                //     {
                //         loader: 'file-loader',
                //         options: {
                //             name: '[path][name].[ext]',
                //         },
                //     },
                // ],
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: ['@babel/plugin-syntax-dynamic-import'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            lessOptions: {
                                // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                                modifyVars: {
                                    // 'primary-color': '#1DA57A',
                                    // 'link-color': '#1DA57A',
                                    // 'border-radius-base': '2px',
                                },
                                javascriptEnabled: true,
                            },
                        },
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new HTMLWebpackPlugin({
            template: path.join(SRC_DIRECTORY, 'index.html'),
        }),
        new MiniCssExtractPlugin(),
    ],
    output: {
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
}
