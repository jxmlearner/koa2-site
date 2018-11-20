const Role = require('../models/role')
const Result = require('../models/result')

let result = new Result()

module.exports = {
    getPage: async (ctx, next) => {  //获取分页数据
        let { app } = ctx
        let { pageIndex: page = 1, pageSize: limit = 20, where } = ctx.request.body

        let err, data
        [err,data] = await app.util.to(app.service.role.getPage({ page, limit, where }))
        if (err){  //如果有错误
            ctx.response.body=result.error("数据获取失败")
        }
        else
            ctx.response.body = result.pageresult("获取成功", data)
    },
    editAction: async (ctx, next) => {
        let { app }= ctx
        // TODO: 验证传过来的参数是否正确
        let err,data
        let obj=ctx.request.body
        if(obj.id) {  //如果有id值,说明是修改
            obj.id = obj.id * 1;  //客户端传过来的数值

            [err,data] = await app.util.to(app.service.role.edit(obj))
            if(err){
                ctx.body = result.error('修改失败')
            }else {
                if(data.code){  // 这里是service返回的未修改成功的信息,比如：角色名称已经存在
                    ctx.body = result.error(data.msg)
                }else{
                    // update的返回是受影响的行数                    
                    ctx.body = data > 0 ? result.success('修改成功') : result.error('修改失败')
                }
            } 
        }else{ //添加新记录
            [err,data]=await app.util.to(app.service.role.add(obj))
            if(err){
                ctx.body=result.error('添加失败')
            }else {
                if(data.code){  // 这里是service返回的未添加成功的信息,比如：角色名称已经存在
                    ctx.body=result.error(data.msg)
                }else{
                    // create 方法会返回当前添加成功后的实体                     
                    if(data && data.dataValues.id)
                        ctx.body=result.success('添加成功')
                    else
                        ctx.body=result.error('添加失败')
                }
            }                  
        }
    },
    deleteAction: async (ctx, next) =>{
        let { app }= ctx
        let postData=ctx.request.body
        if(!postData.ids) {
            ctx.body=result.error('请选择要删除的记录')
            return
        }
        let idsArr=postData.ids.split(',').map(id => id*1)  // 将 '1,5,12'这种串转换成数组
        if(idsArr.includes(1)){
            ctx.body=result.error('超级管理员不能被删除,请重新选择')
            return
        }
        let err,data        
        [err,data] = await app.util.to(app.service.role.delete(idsArr))
        if(err){
            ctx.body=result.error('删除失败')
        }else {                    
            if(data)
                ctx.body=result.success('删除成功')
            else
                ctx.body=result.error('删除失败')
        }
    }
}