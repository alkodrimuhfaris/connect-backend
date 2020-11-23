const { User } = require('../models')
const response = require('../helpers/response')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const fs = require('fs')
// const { v4: uuidv4 } = require('uuid')
// const sendMail = require('../helpers/sendMail')

const {
  PUBLIC_UPLOAD_FOLDER
} = process.env

module.exports = {
  createUser: async (req, res) => {
    console.log('wow')
    const { email, password, name, idName, status, phone } = req.body
    const ava = req.file ? 'Uploads/' + req.file.filename : undefined

    const data = { email, password, name, idName, status, phone, ava }

    const schema = joi.object({
      email: joi.string().email(),
      password: joi.string(),
      name: joi.string(),
      idName: joi.string(),
      status: joi.string(),
      phone: joi.string(),
      ava: joi.string()
    })

    const { value: userData, error } = schema.validate(data)
    if (error) {
      ava && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + ava)
      return response(res, 'Error', { error: error.message }, 400, false)
    }
    try {
      let { password } = userData
      password = await bcrypt.hash(password, 10)
      Object.assign(userData, { password })

      // create new data on database
      const results = await User.findByPk({ id: 1 })
      // // delete hashed password and adminId to be displayed
      // delete results.dataValues.password

      return response(res, 'user has created', { results })
    } catch (err) {
      console.log(err)
      return response(res, err.message, { err }, 500, false)
    }
  },
  patchUser: async (req, res) => {
    const { id } = req.user
    const { email, password, name, idName, status, phone } = req.body
    const ava = req.file ? 'Uploads/' + req.file.filename : undefined

    const data = { email, password, name, idName, status, phone, ava }

    const schema = joi.object({
      email: joi.string().email(),
      password: joi.string(),
      name: joi.string(),
      idName: joi.string(),
      status: joi.string(),
      phone: joi.string(),
      ava: joi.string()
    })

    const { value: userData, error } = schema.validate(data)
    if (error) {
      ava && fs.unlinkSync(PUBLIC_UPLOAD_FOLDER + ava)
      return response(res, 'Error', { error: error.message }, 400, false)
    }
    try {
      const user = await User.findByPk(id)
      if (!user) {
        return response(res, 'User Not Found!', {}, 400, false)
      }

      let { password } = userData
      password = await bcrypt.hash(password, 10)
      Object.assign(userData, { password })

      // create new data on database
      const results = await User.create(userData)

      // delete hashed password and adminId to be displayed
      delete results.dataValues.password

      return response(res, 'user updated successfully', { results })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getUser: async (req, res) => {
    const { id } = req.user
    try {
      const results = await User.findByPk(id)
      if (!results) {
        return response(res, 'User Not Found!', {}, 400, false)
      }
      delete results.dataValues.password
      return response(res, 'user profile', { results })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params
    try {
      const results = await User.findByPk(id)
      if (!results) {
        return response(res, 'User Not Found!', {}, 400, false)
      }
      delete results.dataValues.password
      return response(res, 'user profile', { results })
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.user
    try {
      const user = await User.findByPk(id)
      if (!user) {
        return response(res, 'User Not Found!', {}, 400, false)
      }
      await user.destroy()
      return response(res, 'user deleted successfully')
    } catch (err) {
      return response(res, err.message, { err }, 500, false)
    }
  }
}
