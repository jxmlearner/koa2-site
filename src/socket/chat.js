const socketIO = require('socket.io')


class chat {
    constructor(http) {
        this.io = socketIO(http)
        this.ioListen()
    }

    ioListen() {
        let io=this.io
        io.on('connection', socket => {
            console.log('a user connected')

            socket.on('disconnect', function () {
                console.log('user disconnected');
            });

            socket.on('chat message', function (msg) {
                //io.emit('chat message',msg)    //这种方式的广播消息,所有的连接（包括自己）客户端都能收到
                socket.broadcast.emit('chat message',msg)
            });
        })
    }
}

module.exports = chat