const Result=require('../models/result')

let result=new Result()

module.exports={
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