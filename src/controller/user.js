const Result=require('../models/result')
const md5=require('md5')
const jwt=require('jsonwebtoken')
const config=require('../config/config')

let result=new Result()

module.exports={
  login:async(ctx,next)=>{                     //用户登录页视图
    await ctx.render('admin/login')
  },
  logout:async(ctx,next)=>{
    // TODO: 如果是用的session保留用户登录信息,这里应该清空session
    ctx.response.body=result.success('退出成功')
  },
  loginAction:async(ctx,next)=>{               //验证用户名和密码信息
    let { app }= ctx
    let { username,userpwd:password }=ctx.request.body
    // TODO: 将密码进行加密后比较
    let md5Pwd=md5(password)

    let err, user
    user= await app.service.user.getUserByName(username)
    if(err){
      ctx.response.body=result.error('获取用户名和密码执行出错')
    } else {
      if(!user){
        ctx.response.body=result.error(`登录用户${username}不存在`)
        return 
      }
      if(md5Pwd !== user.password ){
        ctx.response.body=result.error('密码错误')
        return 
      }
      // TODO: 生成 token 返回给客户端
      const token = jwt.sign(user.dataValues, config.tokenSecret, {expiresIn: '1h'})  //token签名 有效期为1小时
      
      ctx.response.body=result.success('登录成功',token)
    }
  },
  getAll:async(ctx,next)=>{
    let {app}=ctx
    let users=await app.service.user.getAll();
    console.log(users)
    //ctx.body=result.success('获取成功',users)
    // let users=[{
    //     username:'jiang',
    //     userpwd:'123456'
    // }]
    await ctx.render('admin/user',{users})
  },
  getPage:async(ctx,next)=>{   //分页数据获取
    let {app}=ctx
    let {pageIndex:page=1,pageSize:limit=10,where}=ctx.request.body

    let data=await app.service.user.getPage({page,limit,where})
    ctx.response.body=result.pageresult("获取成功",data)
  }
}