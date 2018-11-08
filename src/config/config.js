module.exports = {
	//开发环境配置
	development: {
		port: 3000,  //启动端口
		//数据库配置
		database: {
			user: 'postgres',
			host: '127.0.0.1',
			password: 'postgres',
			database: 'nodeserverdb',
			port: '5432'
		}
	},
	//生产环境配置
	production: {
		port: 4090,  //启动端口
		//数据库配置
		database: {
			user: 'postgres',
			host: '127.0.0.1',
			password: 'postgres',
			database: 'nodeserverdb',
			port: '5432'
		}
	}
}