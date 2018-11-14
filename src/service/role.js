const sequelize = require('../util/db')
const Role = require('../models/role')

module.exports = {
  getAll: async () => {
    return await Role.findAll()
  },
  getPage:async({page,limit,where})=>{    
    return await Role.findAndCountAll({offset:(page-1)*limit,limit})
  }
}