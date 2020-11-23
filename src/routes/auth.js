const route = require('express').Router()
const authCtl = require('../controllers/auth')

route.post('/signup', authCtl.signup)
route.post('/login', authCtl.loginByEmail)

module.exports = route
