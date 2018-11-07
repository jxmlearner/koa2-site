$(function(){
    var socket=io()
    var onLineUsers=[]
    var currentUser=null

    socket.on('connect', () => {
        console.log(socket.id)
        socket.emit('check if olduser')
        socket.emit('get online users')   //去获取在线用户列表
    })

    socket.on('check if olduser',(flag)=>{
        if(flag){   //说明是已经存在的用户,现在是重新连接上服务器
            return
        }
        //弹出输入用户名的modal
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        })
    })
    socket.on('get online users',users=>{
        setOnLineUserList(users)
    })

    socket.on('chat message',function(msg){
        console.log(msg);
        toastr.info('Are you the 6 fingered man?')
    })

    socket.on('leave chat',function(leaveUser){
        if(leaveUser){
            toastr.error(leaveUser.name+'离开了!')
        }        
    })

    socket.on('notify user login',loginuser=>{
        toastr.info(`用户${loginuser.name}上线了`)
    })

    //设置左侧在线用户列表
    function setOnLineUserList(users){
        console.log(users)
        onLineUsers=users
        var html=users.reduce((cur,next)=>{
            var temp=`<li><a href="javascript:void(0);" title="${next.name}"><img src="${next.img}" class="img-thumbnail"><span>${next.name}</span></a></li>`;
            return cur+=temp;
        },'')
        $("#onLineUsers").html(html);
    }

    //login
	$('#btn-setName').click(function(){
		var name = $('#username').val();

        if(!name) {toastr.warning('昵称不能为空！'); return}
		if(checkUser(name)){
			$('#username').val('');
			toastr.warning('昵称已经存在！');
		}else{
			var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
			var randomNum = Math.floor(Math.random()*5);
			//random user
			var img = imgList[randomNum];
			//package user
			var dataObj = {
                id:socket.id,
				name:name,
				img:img
			};
			//send user info to server
			socket.emit('login',dataObj);
			//hide login modal
			$('#myModal').modal('hide');
			$('#username').val('');
            $('#msg').focus();
            setCurrentUser(dataObj)
		}
    });
    //check is the username exist.
    function checkUser(name){
        var findUser=onLineUsers.find(u=>u.name==name);
        return findUser?true:false;
    }
    function setCurrentUser(user){
        currentUser=user;
        $("#spanuser").html(`欢迎您！ ${user.name}`)
    }
})