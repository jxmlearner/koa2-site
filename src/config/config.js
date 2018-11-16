const env=process.env.NODE_ENV || 'development'

let tokenSecret ='!@#&@!*&#@*#*(%#)@489795~@#@*&'

let port, database
if(env === 'development') { // 如果是开发环境
	port = 3000
	database = {
		user: 'postgres',
		host: '127.0.0.1',
		password: 'postgres',
		database: 'nodeserverdb',
		port: '5432'
	}
}

if(env === 'production') { // 如果是生产环境
	port = 4090
	database = {
		user: 'postgres',
		host: '127.0.0.1',
		password: 'postgres',
		database: 'nodeserverdb',
		port: '5432'
	}
}

module.exports = {
	tokenSecret,
	port,
	database
}