const sequelize = require('../util/db')
const Role = require('../models/role')
const Op=require('sequelize').Op

module.exports = {
  getAll: async () => {
    return await Role.findAll()
  },
  getPage:async({page,limit,where})=>{ // 取角色的分页数据 
    return await Role.findAndCountAll({offset:(page-1)*limit,limit})
  },
  add: async(role) => {   //添加角色
    let fRole=await Role.find({where:{rolename:role.rolename}})
    if(fRole){
        return {code:100,msg:'角色名称已经存在'}
    }
    return await Role.create(role)
  },
  edit: async(role) =>{   //修改角色
    // 编辑某角色的时候,首先要查找数据库中id不是该角色id的记录中是否存在同名的角色
    let fRole=await Role.find({where:{
        id: {[Op.ne]:role.id },
        rolename: {[Op.eq]:role.rolename}
    }})
    if(fRole){
        return {code:100,msg:'角色名称已经存在'}
    }
    let id=role.id
    delete role.id
    return await Role.update(role,{where:{id:id}})
  },
  delete: async(ids) => {     
      return await Role.destroy({ where: {
          id:{[Op.in]:ids}
      }})
  }
}