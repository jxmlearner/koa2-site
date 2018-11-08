// 引入规则中件间
const path = require("path");
const miRule = require('./mi-rule')

//引入log4js帮助js
const logUtil = require('../util/logUtil')

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

  app.use(async(ctx,next)=>{
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
}