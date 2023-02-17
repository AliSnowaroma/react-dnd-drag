'use strict'
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');

module.exports = {
  mode:'production',
    entry: path.resolve(__dirname, '../src/index.tsx'),
    output: {
      filename: 'js/bundle[hash].js',
      path: path.resolve(__dirname, '../dist'),
      chunkFilename: 'js/[name][hash].chunk.js',
      // publicPath这样配置后，访问页面路径变为：127.0.0.1:9999/test
      publicPath:'/test', // publicPath设置值不是'/'时， devServer static选项directory静态服务才会生效
    },
    devtool:'source-map',
    resolve:{
        extensions:[".ts",".tsx",".js", ".json"]
    },
    performance: {
      hints: "warning", // 枚举
      maxAssetSize: 30000000, // 整数类型（以字节为单位）
      maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
      assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');

      }
    },
    module:{
        rules:[
          {
            oneOf:[
              {
                test:/\.(ts|tsx)$/,
                use:[
                  {
                    loader:'ts-loader',
                    options: {
                      transpileOnly: true,    // 只进行语法转换,不进行类型校验,提高构建速度
                    }
                  }
                ]
              },
              {
                test:/\.(js|jsx|mjs)$/,
                use:[
                  {
                    loader:'babel-loader',
                  }
                ]
              },
              {
                test:/\.css$/,
                use:[
                  {
                    loader:MiniCssExtractPlugin.loader
                  },
                  {
                    loader:'css-loader'
                  }
                ]
              },
              {
                test:/\.scss$/,
                use:[
                  {
                    loader:MiniCssExtractPlugin.loader
                  },
                  {
                    loader:'css-loader'
                  },
                  {
                    loader:'sass-loader'
                  }
                ]
              },
              {
                test:/\.less$/,
                use:[
                  {
                    loader:MiniCssExtractPlugin.loader
                  },
                  {
                    loader:'css-loader'
                  },
                  {
                    loader:'less-loader'
                  }
                ]
              },
              {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'), // 使用url-loader必须安装file-loader
                options: {
                  limit: imageInlineSizeLimit,
                  name: '/imgs/[name].[hash:8].[ext]',
                },
              },
            ]
          }
        ]
    },
    resolve:{
      alias:{
        "@src": path.resolve(__dirname, "../src")
      },
      extensions: [".js",".jsx",".json",".ts",".tsx"]
    },
    plugins:[
      new WebpackBar(),
      new ProgressBarWebpackPlugin(),
      new CleanWebpackPlugin(),
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, '../index.html')
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "css/[name][hash].css",
        chunkFilename: "css/[id].css"
      }),

    ]
}
