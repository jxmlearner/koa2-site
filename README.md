# 使用 Koa2构建一个图书站点, 练习 socket.io,nunjucks,等技术使用

## 1、安装包

+ 1、npm init -y
+ 2、cnpm i -S koa koa-router koa-views nunjucks koa-static koa-bodyparser koa-json kcors koa-logger log4js
+ 3、安装调试工具 并配置package.json中的运行脚本 
cnpm i -D nodemon

scripts:{
	"dev":"nodemon -w src src/app.js"
}

+ 4、cnpm i -S socket.io

var server = require('http').Server(app.callback());

src/app.js
```
const Koa=require('koa')
const path=require('path')
const views=require('koa-views')
const nunjucks=require('nunjucks')
const cors=require('kcors')
const json=require('koa-json')
const koaLogger=require('koa-logger')              //开发阶段的终端日志（访问日志）
const bodyparser=require('koa-bodyparser')
const static=require('koa-static')                 //静态资源
const router=require('./router/routes')            //路由
const chat=require('./socket/chat')


const app=new Koa()

// 静态资源目录对于相对入口文件app.js的路径
app.use(static(path.join( __dirname,  './public')))

const nunjucksEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, 'view'))
)
//使用nunjucks模板
app.use(views(path.join(__dirname, './view'),{
    options: {
        nunjucksEnv: nunjucksEnv
    },
    map:{html:'nunjucks'}
}))

app.use(koaLogger())  //开发日志
app.use(cors())       //允许跨域
app.use(json())       
app.use(bodyparser())

//加载路由
router(app);

const config = require('./config/config')   //配置文件

// 必须放在所有app.user()之后
var server = require('http').Server(app.callback());
chat.initialize(server)

//通过process.env.NODE_ENV来判断是开发还是生产环境,从而加载不同的配置信息
const env = process.env.NODE_ENV || 'development' // Current mode

server.listen(config[env].port,()=>{
  console.log(`✅ server is running at http://localhost:${config[env].port}`)
})

```

src/router/routes.js
```
const Router = require('koa-router')

module.exports = app => {
  const router = new Router()
  //const apiRouter = new Router()

  router.get('/', async (ctx, next) => {
    var vm = {
      title: '首页'
    }
    await ctx.render('index', vm)
  })


  //apiRouter.post('/user/login',app.controller.user.login)
  //apiRouter.get('/user/getall',app.controller.user.getAll)

  //设定api路由为router的子路由
  //router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

  //如果匹配不到路由则返回404
  router.all('/*', async (ctx, next) => {
    ctx.response.status = 404;
    ctx.response.body = `<h1>~~oops page not found!</h1>`
  })
  app.use(router.routes()).use(router.allowedMethods())
}
```

src/config/config.js
```
module.exports={
	//开发环境配置
	development:{
		port:3000,  //启动端口
		//数据库配置
		database:{
			user:'root',
			host:'localhost',
			password:'123456',
			database:'nodeserverdb',
			port:'3306'
		}
	},
	//生产环境配置
	production:{
		port:4090,  //启动端口
	  //数据库配置
	  database:{
			user:'root',
			host:'localhost',
			password:'123456',
			database:'nodeserverdb',
			port:'3306'
		}
	}
}
```



## 2、加入 mvc的controller和service的中间件
## 3、加入 log4js日志记录 cnpm i -S log4js  日志文件的配置在 config/log_config.js



