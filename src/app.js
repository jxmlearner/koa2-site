const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const nunjucks = require('nunjucks')               //nunjucks模板引擎
const cors=require('kcors')                        //允许跨域
const json=require('koa-json')
const koaLogger=require('koa-logger')              //开发阶段的终端日志（访问日志）
const bodyparser=require('koa-bodyparser')
const static=require('koa-static')                 //静态资源

const router = require('./router/routes')          //路由
const chat=require('./socket/chat')                //聊天室 类

const app = new Koa()

// 静态资源目录对于相对入口文件app.js的路径
app.use(static(path.join( __dirname,  './public')))

//nunjucks模板路径
const nunjucksEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, 'view'))
)
app.use(views(path.join(__dirname, './view'), {
    options: {
        nunjucksEnv: nunjucksEnv
    },
    map: { html: 'nunjucks' }
}))


app.use(koaLogger())  //开发日志
app.use(cors({credentials: true}))       //允许跨域,并且允许附带cookie
app.use(json())       
app.use(bodyparser())

//加载路由
router(app);

var http = require('http').createServer(app.callback())           //socket.io的处理
const chatSocket=new chat(http)

const config = require('./config/config')   //配置文件
//通过process.env.NODE_ENV来判断是开发还是生产环境,从而加载不同的配置信息
const env = process.env.NODE_ENV || 'development' // Current mode

http.listen(config[env].port, () => {                           //重点：  因为使用了socket.io, 要使用上面的http变量来listen, 以前忘记改,调试半天找不到原因
    console.log(`✅ server is running at http://localhost:${config[env].port}`)
})