'use strict'
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { ProgressPlugin } = require('webpack')
const proxy = require('./env/proxy')

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    // publicPath这样配置后，访问页面路径变为：127.0.0.1:9999/test
    publicPath: '/test', // publicPath设置值不是'/'时， devServer static选项directory静态服务才会生效
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true, // 只进行语法转换,不进行类型校验,提高构建速度
                },
              },
            ],
          },
          {
            test: /\.(js|jsx|mjs)$/,
            use: [
              {
                loader: 'babel-loader',
              },
            ],
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
              },
            ],
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: imageInlineSizeLimit,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
    }),
    new ProgressPlugin({
      activeModules: true, // 默认false，显示活动模块计数和一个活动模块正在进行消息。
      entries: true, // 默认true，显示正在进行的条目计数消息。
      modules: false, // 默认true，显示正在进行的模块计数消息。
      modulesCount: 5000, // 默认5000，开始时的最小模块数。PS:modules启用属性时生效。
      profile: false, // 默认false，告诉ProgressPlugin为进度步骤收集配置文件数据。
      dependencies: false, // 默认true，显示正在进行的依赖项计数消息。
      dependenciesCount: 10000, // 默认10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
    }),

  ],
  devServer: { // 配置devServer时，打包文件不会输出
    hot: true,
    port: 9999,
    host: '127.0.0.1',
    open: true,
    ...proxy,
  },
}
