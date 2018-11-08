const sequelize = require('../util/db')
const User = require('../models/user')

module.exports = {
  getAll: async () => {
    return await User.findAll()
  }
}