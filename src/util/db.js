const Sequelize = require('sequelize');
const config = require('../config/config')   //配置文件
const env = process.env.NODE_ENV || 'development' // Current mode

module.exports=new Sequelize(config[env].database.database, config[env].database.user, config[env].database.password, {
  host: config[env].database.host,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,   // 连接池中最大连接数量
    min: 0,
    acquire: 30000,
    idle: 10000  // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  }
});