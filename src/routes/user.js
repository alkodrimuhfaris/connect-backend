const route = require('express').Router()
const userCtl = require('../controllers/user')

const multerSingle = require('../middlewares/multerSingle')
const authMiddleware = require('../middlewares/auth')

route.post('/create', multerSingle('avatar'), userCtl.createUser)
route.patch('/update', authMiddleware, multerSingle('avatar'), userCtl.patchUser)
route.get('/', authMiddleware, userCtl.getUser)
route.delete('/delete', authMiddleware, userCtl.deleteUser)

route.get('/get/all', authMiddleware, userCtl.getAllUser)
route.get('/get/detail/:id', authMiddleware, userCtl.getUserById)

// password
route.get('/check/password', authMiddleware, userCtl.getPassword)
route.patch('/password/update', authMiddleware, userCtl.changePassword)
route.patch('/password/add', authMiddleware, userCtl.addPassword)

module.exports = route
