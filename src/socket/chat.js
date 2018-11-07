const socketIO = require('socket.io')

class User{
    constructor(id,name,img){
        this.id=id
        this.name=name              //用户名
        this.img=img                //用户头像
    }
}


class chat {
    constructor(http) {
        this.io = socketIO(http)
        this.onLineUsers=new Map()
        this.ioListen()
    }

    ioListen() {
        let io=this.io
        let that=this;
        io.on('connection', socket => {
            //有一个用户连接过来了
            

            //检查是否是已经存在的用户
            socket.on('check if olduser',function(){
                var user=that.onLineUsers.get(socket.id)
                //var users=user?[...that.onLineUsers.values()]:[]
                socket.emit('check if olduser',user?true:false)
            })

            //取在线用户列表
            socket.on('get online users',function(){
                socket.emit('get online users',[...that.onLineUsers.values()])
            })

            //用户登录
            socket.on('login',user=>{
                //将用户添加至在线用户列表中
                user.id=socket.id
                that.onLineUsers.set(socket.id,user)
                //接着触发客户端去重新获取用户列表  --通知所有客户端
                io.emit('get online users',[...that.onLineUsers.values()])

                //给其它的客户端发送通知,我上线了
                socket.broadcast.emit('notify user login',user)
            })
            

            socket.on('disconnect', function () {
                //用户断开连接
                var leaveUser=that.onLineUsers.get(socket.id)
                that.onLineUsers.delete(socket.id)
                io.emit('leave chat',leaveUser)
            });

            socket.on('chat message', function (msg) {
                io.emit('chat message',msg)    //这种方式的广播消息,所有的连接（包括自己）客户端都能收到
                //socket.broadcast.emit('chat message',msg)
            });
        })
    }
}

module.exports = chat