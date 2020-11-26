const { Op } = require('sequelize')

module.exports = (req) => {
  console.log(req.search)
  let { search = '', order = { name: 'ASC' }, idName = '', phone = '' } = req
  console.log(search)

  const whereName = { [Op.and]: { name: { [Op.like]: `%${search}%` } } }

  let where = [
    { name: { [Op.like]: `%${search}%` } }
  ]

  order = Object.entries(order)

  idName = idName ? { idName } : null
  idName && where.push(idName)

  phone = phone ? { phone } : null
  phone && where.push(phone)

  where = { [Op.and]: where }

  return ({
    where, order, whereName
  })
}
