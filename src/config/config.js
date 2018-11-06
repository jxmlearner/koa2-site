module.exports={
	//开发环境配置
	development:{
		port:3000,  //启动端口
		//数据库配置
		database:{
			user:'root',
			host:'localhost',
			password:'123456',
			database:'nodeserverdb',
			port:'3306'
		}
	},
	//生产环境配置
	production:{
		port:4090,  //启动端口
	  //数据库配置
	  database:{
			user:'root',
			host:'localhost',
			password:'123456',
			database:'nodeserverdb',
			port:'3306'
		}
	}
}