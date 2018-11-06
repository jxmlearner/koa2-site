$(function(){
    var socket=io()

    socket.on('chat message',function(msg){
        console.log(msg);
        toastr.info('Are you the 6 fingered man?')
    })

    socket.on('leave chat',function(leaveUser){
        toastr.error(leaveUser+'离开了!')
    })

})