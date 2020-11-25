const { Op } = require('sequelize')

module.exports = (req) => {
  console.log(req.search)
  let { search = '', order = { createdAt: 'DESC' }, from = {}, to = {} } = req
  console.log(search)

  let where = [
    {
      chat: {
        [Op.like]: `%${search}%`
      }
    }
  ]

  order = Object.entries(order)

  from = Object.keys(from).length
    ? Object.entries(from).map(item => {
        item = {
          [item[0]]: { [Op.gte]: item[1] }
        }
        return item
      })
    : null
  from && where.push(...from)

  to = Object.keys(to).length
    ? Object.entries(to).map(item => {
        item = {
          [item[0]]: { [Op.lte]: item[1] }
        }
        return item
      })
    : null

  to && where.push(...to)

  where = { [Op.and]: where }

  return ({
    where, order
  })
}
