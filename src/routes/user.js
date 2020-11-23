const route = require('express').Router()
const userCtl = require('../controllers/user')

const multerSingle = require('../middlewares/multerSingle')
const authMiddleware = require('../middlewares/auth')

route.post('/create', multerSingle('avatar'), userCtl.createUser)
route.patch('/update', authMiddleware, multerSingle('avatar'), userCtl.patchUser)
route.get('/', authMiddleware, userCtl.getUser)
route.delete('/delete', authMiddleware, userCtl.deleteUser)

module.exports = route
