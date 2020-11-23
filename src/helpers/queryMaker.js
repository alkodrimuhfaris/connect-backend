const { Op } = require('sequelize')

module.exports = (req) => {
  console.log(req.search)
  let { search = { id: '' }, order = { createdAt: 'DESC' }, from = {}, to = {}, condition = {} } = req
  console.log(search)

  search = Object.entries(search).map(item => {
    item = {
      [item[0]]: {
        [Op.like]: `%${item[1]}%`
      }
    }
    return item
  })

  let where = [...search]

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

  condition = Object.keys(condition).length
    ? Object.entries(condition).map(item => {
        item = {
          [item[0]]: item[1]
        }
        return item
      })
    : null

  condition && where.push(...condition)

  where = { [Op.and]: where }

  return ({
    where, order
  })
}
