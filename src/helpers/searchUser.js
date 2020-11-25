const { Op } = require('sequelize')

module.exports = (req) => {
  console.log(req.search)
  let { search = '', order = { name: 'ASC' }, id = '' } = req
  console.log(search)

  const whereName = { [Op.and]: { name: { [Op.like]: `%${search}%` } } }

  let where = [
    {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ]
    }
  ]

  order = Object.entries(order)

  id = id ? { id } : null
  id && where.push(id)

  where = { [Op.and]: where }

  return ({
    where, order, whereName
  })
}
