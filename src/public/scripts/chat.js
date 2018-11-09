$(function () {
    var socket = io()
    var onLineUsers = []
    var currentUser = null

    socket.on('connect', () => {
        console.log(socket.id)
        socket.emit('check if olduser')
        socket.emit('get online users')   //去获取在线用户列表
    })

    socket.on('check if olduser', (flag) => {
        if (flag) {   //说明是已经存在的用户,现在是重新连接上服务器
            return
        }
        //弹出输入用户名的modal
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        })
    })
    socket.on('get online users', users => {
        setOnLineUserList(users)
    })

    //收到群聊消息
    socket.on('chat to all', function (msg,sender) {    
        receiveMsg(msg,sender)
    })

    socket.on('leave chat', function (leaveUser) {
        if (leaveUser) {
            toastr.error(leaveUser.name + '离开了!')
        }
    })

    socket.on('notify user login', loginuser => {
        toastr.info(`用户${loginuser.name}上线了`)
    })

    socket.on('chat to one',(msg,sender)=>{
        receiveMsg(msg,sender)
    })

    //设置左侧在线用户列表
    function setOnLineUserList(users) {
        onLineUsers = users
        var html = users.reduce((cur, next) => {
            var temp = `<li><a  data-id="${next.id}" title="${next.name}"><img src="${next.img}" class="img-thumbnail"><span>${next.name}</span></a></li>`;
            return cur += temp;
        }, '')
        $("#onLineUsers").html(html);
    }

    $("#username").on('keypress',function(e){
        if(e.keyCode==13) $('#btn-setName').click()
    })
    //login
    $('#btn-setName').click(function () {
        var name = $('#username').val();

        if (!name) { toastr.warning('昵称不能为空！'); return }
        if (checkUser(name)) {
            $('#username').val('');
            toastr.warning('昵称已经存在！');
        } else {
            var imgList = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg", "/images/5.jpg"];
            var randomNum = Math.floor(Math.random() * 5);
            //random user
            var img = imgList[randomNum];
            //package user
            var dataObj = {
                id: socket.id,
                name: name,
                img: img
            };
            //send user info to server
            socket.emit('login', dataObj);
            //hide login modal
            $('#myModal').modal('hide');
            $('#username').val('');
            $('#msg').focus();
            setCurrentUser(dataObj)
        }
    });
    //check is the username exist.
    function checkUser(name) {
        var findUser = onLineUsers.find(u => u.name == name);
        return findUser ? true : false;
    }
    function setCurrentUser(user) {
        currentUser = user;
        $("#spanuser").html(`欢迎您！ ${user.name}`)
    }

    //群聊天信息输入框
    $("#msg").keydown(function (e) {
        if (e.keyCode == 13) {
            sendMsgToAll()
        }
    })
    $('#sendMsg').on('click',function(){
        sendMsgToAll()
    })

    //跟所有人聊天
    function sendMsgToAll() {
        var msg = $('#msg').val()
        if (!msg) { toastr.warning('聊天信息不能为空'); return; }
        socket.emit('chat to all',msg,currentUser)
        addMySelfMsg(msg)   
        $("#msg").val('')   //清空输入框
    }

    //消息内容窗口增加自己刚刚的群聊消息
    function addMySelfMsg(msg){
        html=`<div class="message-reply">
        <div class="message-info">
          <div class="user-info"><img title="${currentUser.name}" src="${currentUser.img}" class="user-avatar img-thumbnail"></div>
          <div class="message-content-box">
            <div class="arrow"></div>
            <div class="message-content">${msg}</div>
          </div>
        </div>
      </div>`
        $('.msg-content').append($(html))
    }
    //收到其它人发的消息
    function receiveMsg(msg,sender){
        html=`<div class="message-receive">
        <div class="message-info">
          <div class="user-info"><img title="${sender.name}" src="${sender.img}" class="user-avatar img-thumbnail"></div>
          <div class="message-content-box">
            <div class="arrow"></div>
            <div class="message-content">${msg}</div>
          </div>
        </div>
      </div>`
        $('.msg-content').append($(html))
    }

    //在线用户列表的单个项点击事件 (点击某个用户私聊)
    $("#onLineUsers").on('click',"li>a",function(){
        let toUserId=$(this).data('id')
        let toUserName=$(this).attr('title')
        if(toUserId==currentUser.id){
            toastr.warning('oops，不能跟自己聊天啦')
            return
        }
        $("#hid_msgTo").val(toUserId)
        $("#myModalLabel1").html(`正在与${toUserName}聊天`)
        //弹出私聊的modal
        $('#setMsgToOne').modal({
            backdrop: 'static'
        })
    })

    $("#input_msgToOne").keydown(function(e){
        if(e.keyCode==13) $("#btn_toOne").click()
    })
    $("#btn_toOne").click(function(){
        var msg=$("#input_msgToOne").val();
        if(!msg) {toastr.warning('聊天内容不能为空！'); return;}
        socket.emit('chat to one',msg,currentUser,$("#hid_msgTo").val())
        addMySelfMsg(msg)   
        $("#input_msgToOne").val('')   //清空输入框
        $("#hid_msgTo").val('')
        $('#setMsgToOne').modal('hide');
    })

})