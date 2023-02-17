const webpack = require('webpack')
const path = require('path')
const config = require('../config/webpack-production-config')

const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
// const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

const getPreviousFileSizes = measureFileSizesBeforeBuild(path.resolve(__dirname, '../dist'))
// console.log('previousFileSizes', previousFileSizes)
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

getPreviousFileSizes.then((previousFileSizes) => {
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }

      return
    }

    const info = stats.toJson()
    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    // Log result...
    // 处理完成
    console.log('打包完成')
    printFileSizesAfterBuild(
      stats,
      previousFileSizes,
      path.resolve(__dirname, '../dist'),
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE,
    )
  })
})
