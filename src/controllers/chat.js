const { Chat, User } = require('../models')
const response = require('../helpers/response')
const joi = require('joi')
const { Op } = require('sequelize')
const pagination = require('../helpers/pagination')
const io = require('../app')

module.exports = {
  createChat: async (req, res) => {
    const { id: sender } = req.user
    const { id: reciever } = req.params
    const { chat } = req.body

    const data = { chat, sender, reciever, lastChat: true, unread: true }

    const schema = joi.object({
      chat: joi.string(),
      sender: joi.number(),
      reciever: joi.number(),
      lastChat: joi.boolean(),
      unread: joi.boolean()
    })
    const { value: chatData, error } = schema.validate(data)
    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      const getLastChat = await Chat.findOne({
        where: {
          lastChat: true,
          [Op.or]: [
            { [Op.and]: [{ reciever }, { sender }] },
            { [Op.and]: [{ reciever: sender }, { sender: reciever }] }
          ]
        }
      })

      if (getLastChat) {
        await getLastChat.update({ lastChat: false })
      }
      const sendChat = await Chat.create(chatData)
      const senderData = await User.findByPk(
        sender,
        {
          attributes: { exclude: ['password'] }
        }
      )
      io.emit(`send ${reciever}`, { senderData, chat })
      return response(res, 'sent chat success', { sendChat })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  updateRead: async (req, res) => {
    const { id: reciever } = req.user
    const { id: sender } = req.params
    try {
      const unreadChat = await Chat.findAll({
        where: {
          sender,
          reciever,
          unread: true
        }
      })
      if (!unreadChat.length) {
        return response(res, 'all chat has been read')
      }
      await unreadChat.update({ unread: false })
      io.emit(`read ${reciever}`, { reciever, read: true })
      return response(res, 'all recent chat has been updated to read')
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  updateChat: async (req, res) => {
    const { id } = req.params
    if (!Number(id)) {
      return response(res, 'chat ID must be a number', {}, 400, false)
    }

    const schema = joi.object({
      chat: joi.string()
    })
    const { value: chatData, error } = schema.validate(req.body)
    if (error) {
      console.log(error)
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      const getChat = await Chat.findByPk(id)
      if (!getChat) {
        return response(res, 'Chat not found!', {}, 400, false)
      }
      const update = await getChat.update(chatData)

      return response(res, 'chat updated succesfully', { update })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  deleteChat: async (req, res) => {
    const { id } = req.params
    if (!Number(id)) {
      return response(res, 'chat ID must be a number', {}, 400, false)
    }

    try {
      const getChat = await Chat.findByPk(id)
      if (!getChat) {
        return response(res, 'Chat not found!', {}, 400, false)
      }
      const delChat = await getChat.destroy()

      return response(res, 'chat deleted succesfully', { delChat })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  getChatById: async (req, res) => {
    const { id } = req.params
    if (!Number(id)) {
      return response(res, 'chat ID must be a number', {}, 400, false)
    }

    try {
      const getChat = await Chat.findByPk(id)
      if (!getChat) {
        return response(res, 'Chat not found!', {}, 400, false)
      }

      return response(res, 'get chat successfully', { getChat })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  getAllChatByColluctor: async (req, res) => {
    const { id: self } = req.user
    let { id: colluctor } = req.params
    if (!Number(colluctor)) {
      return response(res, 'colluctor id must be a number', {}, 400, false)
    }
    colluctor = Number(colluctor)

    const path = 'chat/colluctor/' + colluctor
    const { limit, page, offset } = pagination.pagePrep(req.query)

    try {
      let count = 0
      let results = []
      const colluctorProfile = await User.findByPk(
        colluctor,
        {
          attributes: { exclude: ['password'] }
        }
      )

      if (!colluctorProfile) {
        return response(res, 'colluctor not found', {}, 400, false)
      }

      if (limit !== '-') {
        ({ count, rows: results } = await Chat.findAndCountAll({
          limit,
          offset,
          where: {
            [Op.or]: [
              { [Op.and]: [{ reciever: self }, { sender: colluctor }] },
              { [Op.and]: [{ reciever: colluctor }, { sender: self }] }
            ]
          },
          order: [['createdAt', 'DESC']]
        }))
      } else {
        ({ count, rows: results } = await Chat.findAndCountAll({
          where: {
            [Op.or]: [
              { [Op.and]: [{ reciever: self }, { sender: colluctor }] },
              { [Op.and]: [{ reciever: colluctor }, { sender: self }] }
            ]
          },
          order: [['createdAt', 'DESC']]
        }))
      }

      const pageInfo = pagination.paging(path, req, count, page, limit)

      if (!results.length) {
        return response(res, 'You have no history chat with this account', { colluctorProfile, results, pageInfo })
      }

      return response(res, 'chat history with id ' + colluctor, { colluctorProfile, results, pageInfo })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  getAllListChat: async (req, res) => {
    const { id: self } = req.user

    const path = 'chat/list/all'
    const { limit, page, offset } = pagination.pagePrep(req.query)

    try {
      let count = 0
      let results = []

      if (limit !== '-') {
        ({ count, rows: results } = await Chat.findAndCountAll({
          limit,
          offset,
          where: {
            [Op.or]: [{ reciever: self }, { sender: self }],
            lastChat: true
          },
          include: [
            {
              model: User,
              as: 'senderProfile',
              attributes: [
                'name', 'ava', 'phone', 'id'
              ]
            },
            {
              model: User,
              as: 'recieverProfile',
              attributes: [
                'name', 'ava', 'phone', 'id'
              ]
            }
          ],
          order: [['createdAt', 'DESC']]
        }))
      } else {
        ({ count, rows: results } = await Chat.findAndCountAll({
          where: {
            [Op.or]: [{ reciever: self }, { sender: self }],
            lastChat: true
          },
          include: [
            {
              model: User,
              as: 'senderProfile',
              attributes: [
                'name', 'ava', 'phone', 'id'
              ]
            },
            {
              model: User,
              as: 'recieverProfile',
              attributes: [
                'name', 'ava', 'phone', 'id'
              ]
            }
          ],
          order: [['createdAt', 'DESC']]
        }))
      }

      const pageInfo = pagination.paging(path, req, count, page, limit)

      console.log(results)

      console.log(results.length)

      if (results.length) {
        results = results.map((result) => {
          const { senderProfile, recieverProfile } = result.dataValues
          let colluctorProfile = {}
          if (senderProfile.id === self) {
            colluctorProfile = {
              ...recieverProfile.dataValues
            }
          } else if (recieverProfile.id === self) {
            colluctorProfile = {
              ...senderProfile.dataValues
            }
          }
          delete result.dataValues.recieverProfile
          delete result.dataValues.senderProfile
          Object.assign(result.dataValues, { colluctorProfile })
          console.log(result)
          return result.dataValues
        })
        return response(res, 'List all chat', { results, pageInfo })
      }

      return response(res, 'You have no history chat start chatting!', { results, pageInfo })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  }
}
