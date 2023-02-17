
'use strict'
const config = require('../config/webpack-dev-config')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

try {
  const compiler = webpack(config)
  const devserverOption = {
    ...config.devServer,
    open: ['/test'],
    client: {
      logging: 'info',
    },
    host: '127.0.0.1',
    // static: ['assets', 'css'],W
  }

  const server = new WebpackDevServer(devserverOption, compiler)

  const runServer = async () => {
    console.log('Starting server...')
    await server.start()
    console.log(`server is running on 127.0.0.1:${devserverOption.port}${config.output.publicPath || '/'}`)
  }

  runServer()
} catch (err) {
  console.log(err)
}
