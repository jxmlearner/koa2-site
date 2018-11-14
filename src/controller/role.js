const Result = require('../models/result')

let result = new Result()

module.exports = {
    getPage: async (ctx, next) => {  //获取分页数据
        let { app } = ctx
        let { pageIndex: page = 1, pageSize: limit = 10, where } = ctx.request.body

        let err, data
        [err,data] = await app.util.to(app.service.role.getPage({ page, limit, where }))
        if (err){  //如果有错误
            ctx.response.body=result.error("数据获取失败")
        }
        else
            ctx.response.body = result.pageresult("获取成功", data)
    }
}