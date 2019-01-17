// 引入规则中件间
const path = require("path");
const miRule = require('./mi-rule')

//引入log4js帮助js
const logUtil = require('../util/logUtil')
const jwt=require('jsonwebtoken')
const jwtKoa = require('koa-jwt')      // 用于路由权限控制
const config = require('../config/config')

module.exports = (app) => {
  /**
   * 在接口的开头调用
   * 指定 controller 文件夹下的 js 文件，挂载在 app.controller 属性
   * 指定 service 文件夹下的 js 文件，挂载在 app.service 属性
   */
  miRule({
    app,
    rules: [
      {
        folder: path.join(__dirname, '../controller'),
        name: 'controller'
      },
      {
        folder: path.join(__dirname, '../service'),
        name: 'service'
      }
    ]
  })

  

  app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
      //开始进入到下一个中间件
      await next();
      ms = new Date() - start;
      //记录响应日志
      logUtil.logResponse(ctx, ms);

    } catch (error) {
      ms = new Date() - start;
      //记录异常日志
      logUtil.logError(ctx, error, ms);
    }
  })

  app.use(async function (ctx, next) {     //如果返回的是401未授权status
    try {
      await next()
    }
    catch (err){
      if (401 == err.status) {
        ctx.status = 200  //这里还是给个成功的返回,只是将code设置成401
        ctx.body = {code:401, msg:'您未提供Authorization header或者身份过期,请登录获取。'}
      } else {
        throw err
      }
    }
  })

  /* 路由权限控制 */
  app.use(jwtKoa({ secret: config.tokenSecret }).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
      /^\/api\/user\/loginAction/,         //登录接口
      /^\/api\/user\/logout/,              //退出接口
      /^((?!\/api).)*$/   // 设置除了私有接口外的其它资源，可以不需要认证访问
    ]
  }))

  app.use(async function (ctx, next) {     // 如果是携带了token的请求,解析这个token并 放置在ctx.user下
    try {
      const authorization = ctx.header.authorization  // 获取jwt
      if(authorization) {
        let token=authorization.split(' ')[1]
        if(token && token.length>10){ //客户端传过来的Authorization: Bearer null会被解析成token为"null",简单点用长度来过滤
          let payload = await jwt.verify(token, config.tokenSecret)  // 解密，获取payload
          ctx.user=payload
        }        
      }
      await next()
    }
    catch (err){    //这个中间件不做任何路由拦截处理，因为koa-jwt已经做了, 这个中间件的作用是，如果token能够解析正确，就把它解析成登录用户对象并赋值给 ctx.user
      throw err
    }
  })
}