const Router = require('koa-router')

module.exports = app => {
    const router = new Router()
    const adminRouter=new Router()

    const apiRouter = new Router()

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

    apiRouter.post('/user/loginAction', app.controller.user.loginAction)      //用户登录
    apiRouter.get('/user/logout',app.controller.user.logout)                  //退出登录
    //apiRouter.get('/user/getall', app.controller.user.getAll)
    apiRouter.post('/user/getpage',app.controller.user.getPage)               //获取用户分页数据
    apiRouter.post('/role/getpage',app.controller.role.getPage)               //获取角色分页数据

    //设定api路由为router的子路由
    router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())


    //管理员路由模块
    adminRouter.get('/login',app.controller.user.login)
    adminRouter.post('/login',app.controller.user.loginAction)

    adminRouter.get('/user',app.controller.user.getAll)

    router.use('/admin',adminRouter.routes(),adminRouter.allowedMethods())

    //如果匹配不到路由则返回404
    router.all('/*', async (ctx, next) => {
        ctx.response.status = 404;
        ctx.response.body = `<h1>~~oops page not found!</h1>`
    })
    app.use(router.routes()).use(router.allowedMethods())
}