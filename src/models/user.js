const Sequelize=require('sequelize')
const sequelize=require('../util/db')

const User=sequelize.define('user',{
  id: {
    type:Sequelize.BIGINT,     //自增主键
    primaryKey:true,
    autoIncrement:true
  },
  username:Sequelize.STRING(30),
  password:Sequelize.STRING(50),
  realname:Sequelize.STRING(30),
  headpic:Sequelize.STRING,                //因为是手动建的表,所以model中的长度啥的都可以不定义
  email:Sequelize.STRING(100),
  mobile:Sequelize.STRING(30),
  createtime:Sequelize.STRING(20),
  lastlogintime:Sequelize.STRING(20),
  logincount:Sequelize.INTEGER
})

module.exports=User