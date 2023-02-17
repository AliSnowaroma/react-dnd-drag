const Koa = require('koa')
const koaStatic = require('koa-static')
const Router = require('koa-router')
const mount = require('koa-mount')
const path = require('path')
const fs = require('fs')

const router = new Router()

const app = new Koa()

app.use(mount('/test', koaStatic(path.resolve(__dirname, '../dist'))))

router.get('/', async (ctx) => {

  ctx.type = 'html'

  ctx.body = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')

})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {

  console.log('server run on localhost:3000')

})
