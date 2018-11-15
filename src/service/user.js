const sequelize = require('../util/db')
const User = require('../models/user')

module.exports = {
  getAll: async () => {
    return await User.findAll()
  },
  getUserByName: async ( username )=>{   // 根据用户名去获取用户
    return await User.findOne({ where: { username }})
  },
  getUserByNameAndPwd: async( username, password )=> {    //根据用户名和密码获取用户
    return await User.findOne({ where:{ username, password }})
  },
  getPage:async({page,limit,where})=>{    //查询分页数据,条件暂时忽略,后续加上
    return await User.findAndCountAll({offset:(page-1)*limit,limit})
  }
}