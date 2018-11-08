class Result{
  error(msg){
    return {code:100,msg:msg}
  }
  success(msg,data){
    return {code:200,msg:msg,data:data}
  }
}

module.exports=Result