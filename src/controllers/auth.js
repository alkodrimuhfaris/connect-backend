const { User } = require('../models')
const response = require('../helpers/response')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// const { v4: uuidv4 } = require('uuid')
// const sendMail = require('../helpers/sendMail')

module.exports = {
  signup: async (req, res) => {
    // get credentials from body
    const { phone } = req.body

    const data = { phone }

    // validating credetntial from body with joi
    const schema = joi.object({
      phone: joi.string().required()
    })
    const { value: credentials, error } = schema.validate(data)

    // error handler from joi
    if (error) {
      console.log(error)
      return response(res, 'Error', { error: error.message }, 400, false)
    }

    try {
      const { phone } = credentials
      const [user, created] = await User.findOrCreate({
        where: { phone },
        attributes: { exclude: ['password'] }
      })

      console.log(user)
      const token = await jwt.sign({
        id: user.dataValues.id,
        phone: user.dataValues.phone
      }, process.env.APP_KEY)

      const msg = created ? 'sign up successfully!' : 'Verification successfully!'

      return response(res, msg, { token, created, user })
    } catch (err) {
      console.log(err)
      return response(res, err, {}, 500, false)
    }
  },
  loginByEmail: async (req, res) => {
    const { email, password } = req.body
    const data = { email, password }

    // schema for joi validate
    const schema = joi.object({
      email: joi.string().required(),
      password: joi.string().required()
    })

    // validate joi
    const { value: credentials, error } = schema.validate(data)

    // error handling on joi
    if (error) {
      return response(res, 'Error', { error: error.message }, 400, false)
    }
    try {
      // check the email address
      const userCheck = await User.findOne({
        where: {
          email: credentials.email
        }
      })

      // error handling when email address is not found
      if (!userCheck) {
        return response(res, 'Wrong email', {}, 400, false)
      }

      // compare password
      const passCheck = await bcrypt.compare(credentials.password, userCheck.dataValues.password)

      // error handling on wrong password
      if (!passCheck) {
        return response(res, 'Wrong password!', {}, 400, false)
      }

      // sign token
      const token = await jwt.sign({
        id: userCheck.dataValues.id,
        phone: userCheck.dataValues.phone
      }, process.env.APP_KEY)

      // final response
      return response(res, 'Login Success!', { token, id: userCheck.dataValues.id })
    } catch (err) {
      return response(res, err.message, {}, 400, false)
    }
  }
}
