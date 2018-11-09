const Result=require('../models/result')

let result=new Result()

module.exports={
  login:async(ctx,next)=>{                     //用户登录页视图
    await ctx.render('admin/login')
  },
  loginAction:async(ctx,next)=>{               //验证用户名和密码信息
    
  },
  getAll:async(ctx,next)=>{
    let {app}=ctx;
    let users=await app.service.user.getAll();
    console.log(users)
    //ctx.body=result.success('获取成功',users)
    // let users=[{
    //     username:'jiang',
    //     userpwd:'123456'
    // }]
    await ctx.render('admin/user',{users})
  }
}