const Sequelize=require('sequelize')
const sequelize=require('../util/db')

const Role=sequelize.define('role',{
  id: {
    type:Sequelize.BIGINT,     //自增主键
    primaryKey:true,
    autoIncrement:true
  },
  rolename:Sequelize.STRING,
  roledesc:Sequelize.STRING
})

module.exports=Role