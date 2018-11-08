# node.js下sequelize的使用

[官方文档](http://docs.sequelizejs.com/manual/installation/getting-started.html)

## 1、cnpm 方式安装

```
cnpm i -S sequelize
cnpm i -S pg pg-hstore     //因为我用的postgres数据库 
```

## 2、创建数据库并建立连接

### 2.1 创建本地数据库

![建数据库](./md/db_create.png)

### 2.2 创建数据库配置  /src/config/config.js

```
module.exports = {
	//开发环境配置
	development: {
		port: 3000,  //启动端口
		//数据库配置
		database: {
			user: 'postgres',
			host: 'localhost',
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
			host: 'localhost',
			password: 'postgres',
			database: 'nodeserverdb',
			port: '5432'
		}
	}
}
```

### 2.3 创建库助手js  /src/util/db.js

```
const Sequelize = require('sequelize');
const config = require('../config/config')   //配置文件
const env = process.env.NODE_ENV || 'development' // Current mode

const sequelize = new Sequelize(config[env].database.database, config[env].database.user, config[env].database.password, {
  host: config[env].database.host,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,   // 连接池中最大连接数量
    min: 0,
    acquire: 30000,
    idle: 10000  // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  },
  define: {
    freezeTableName: true,  // 如果为 true 则表的名称和 model 相同，即 user  为 false MySQL创建的表名称会是复数 users
    timestamps: false
  }
})

/*  测试是否可以连接成功
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
*/
module.exports = sequelize;
```
+ 使用postgres的时候刚开始测试一直连接不上,原来是要设置允许的IP
  + 如我的windows目录：`D:\Program Files\PostgreSQL\9.4\data`
  - pg_hba.conf文件 IPv4下增加 （允许所有IP）
  - host    all             all             0.0.0.0/0            md5
  - postgresql.conf
  - 设置成 listen_addresses = '*'

## 3、建立模型

用户表模型

```
const Sequelize=require('sequelize')
const sequelize=require('../util/db')

const User=sequelize.define('user',{
  id: {
    type:Sequelize.INTEGER,     //自增主键
    primaryKey:true,
    autoIncrement:true
  },
  username:Sequelize.STRING(30),
  password:Sequelize.STRING(50),
  realname:Sequelize.STRING(30),
  email:Sequelize.STRING(100),
  mobile:Sequelize.STRING(30),
  createtime:Sequelize.STRING(20),
  lastlogintime:Sequelize.STRING(20),
  logincount:Sequelize.INTEGER
})

module.exports=User
```




