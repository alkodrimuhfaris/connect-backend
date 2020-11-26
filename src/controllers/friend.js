const { Friend, User } = require('../models')
const response = require('../helpers/response')
const joi = require('joi')
const queryUser = require('../helpers/searchFriend')
const pagination = require('../helpers/pagination')

module.exports = {
  addFriend: async (req, res) => {
    const { id: userId } = req.user
    let { id: friendId } = req.params
    if (!Number(friendId)) {
      return response(res, 'friend ID must be a number', {}, 400, false)
    }
    friendId = Number(friendId)

    try {
      const findId = await User.findByPk(friendId)
      if (!findId) {
        return response(res, 'user id is not exist!', {}, 400, false)
      }
      const getFriend = await Friend.findOne({ userId, friendId })
      if (getFriend) {
        return response(res, 'you already add this user as a friend!', {}, 400, false)
      }
      const result = await Friend.create({ userId, friendId })
      return response(res, 'user on id ' + friendId + ' successfully added as a friend!', { result })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  patchFriend: async (req, res) => {
    const { id: userId } = req.user
    let { id: friendId } = req.params
    if (!Number(friendId)) {
      return response(res, 'friend ID must be a number', {}, 400, false)
    }
    friendId = Number(friendId)

    const { hidden, block, name } = req.body

    const data = { hidden, block, name }

    const schema = joi.object({
      hidden: joi.boolean(),
      block: joi.boolean(),
      name: joi.string()
    })

    const { value: friendData, error } = schema.validate(data)
    if (error) {
      console.log(error)
      return response(res, 'Error', { error: error.message }, 400, false)
    }
    try {
      const findId = await User.findByPk(friendId)
      if (!findId) {
        return response(res, 'user id is not exist!', {}, 400, false)
      }
      const getFriend = await Friend.findOne({ userId, friendId })
      if (!getFriend) {
        return response(res, 'you not add this user yet!', {}, 400, false)
      }
      const result = await getFriend.update(friendData)
      return response(res, 'friend update successfully', { result })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  unfriend: async (req, res) => {
    const { id: userId } = req.user
    let { id: friendId } = req.params
    if (!Number(friendId)) {
      return response(res, 'friend ID must be a number', {}, 400, false)
    }
    friendId = Number(friendId)

    try {
      const findId = await User.findByPk(friendId)
      if (!findId) {
        return response(res, 'user id is not exist!', {}, 400, false)
      }
      const getFriend = await Friend.findOne({ userId, friendId })
      if (!getFriend) {
        return response(res, 'you not add this user yet!', {}, 400, false)
      }
      await getFriend.destroy()
      return response(res, 'unfriend successfully')
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  getFriendById: async (req, res) => {
    const { id: userId } = req.user
    const { id: friendId } = req.params

    try {
      const findId = await User.findByPk(friendId)
      if (!findId) {
        return response(res, 'user id is not exist!', {}, 400, false)
      }
      const result = await Friend.findOne({ userId, friendId })
      if (!result) {
        return response(res, 'you have not add this user yet!', {}, 400, false)
      }
      return response(res, 'get friend successfully', { result })
    } catch (error) {
      console.log(error)
      return response(res, error.message, { error }, 500, false)
    }
  },
  getAllFriends: async (req, res) => {
    const path = 'friend/get/all'
    const { where, order } = queryUser(req.query)
    const { limit, page, offset } = pagination.pagePrep(req.query)

    try {
      const { count, rows: results } = await Friend.findAndCountAll({
        limit,
        offset,
        order,
        include: [
          {
            model: User,
            as: 'FriendDetail',
            where,
            attributes: {
              exclude: ['password']
            }
          }
        ]
      })

      const pageInfo = pagination.paging(path, req, count, page, limit)

      let msg = 'list of all friends'
      if (!results.length) {
        msg = 'there is no friend data in here'
      }
      return response(res, msg, { results, pageInfo })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  }
}
