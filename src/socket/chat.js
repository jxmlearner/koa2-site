const socketIO = require('socket.io')


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
            let onLineUsersCount=this.onLineUsers.size;
            if(!this.onLineUsers.has(socket.id)){
                this.onLineUsers.set(socket.id,'游客'+(onLineUsersCount+1))
            }

            console.log(this.onLineUsers);

            

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