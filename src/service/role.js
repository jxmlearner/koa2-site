const sequelize = require('../util/db')
const Role = require('../models/role')

module.exports = {
  getAll: async () => {
    return await Role.findAll()
  },
  getPage:async({page,limit,where})=>{ // 取角色的分页数据 
    return await Role.findAndCountAll({offset:(page-1)*limit,limit})
  }
}