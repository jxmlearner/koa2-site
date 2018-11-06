const Router = require('koa-router')

module.exports = app => {
    const router = new Router()
    //const apiRouter = new Router()

    router.get('/', async (ctx, next) => {
        let vm = {
            title: 'Nunjucks模板引擎'
        }
        await ctx.render('index', vm)
    })

    router.get('/chat',async(ctx,next)=>{
        let vm={title:'Socket.io 聊天'}
        await ctx.render('chat',vm)
    })

    router.get('/simplechat',async (ctx,next)=>{
        let vm={title:'Socket.io 聊天'}
        await ctx.render('simplechat',vm)
    })

    //apiRouter.post('/user/login', app.controller.user.login)
    //apiRouter.get('/user/getall', app.controller.user.getAll)

    //设定api路由为router的子路由
    //router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

    //如果匹配不到路由则返回404
    router.all('/*', async (ctx, next) => {
        ctx.response.status = 404;
        ctx.response.body = `<h1>~~oops page not found!</h1>`
    })
    app.use(router.routes()).use(router.allowedMethods())
}