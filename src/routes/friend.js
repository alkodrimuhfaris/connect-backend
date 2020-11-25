const route = require('express').Router()
const friendCtl = require('../controllers/friend')

route.post('/add/:id', friendCtl.addFriend)
route.patch('/edit/:id', friendCtl.patchFriend)
route.delete('/unfriend/:id', friendCtl.unfriend)
route.get('/get/detail/:id', friendCtl.getFriendById)
route.get('/get/all', friendCtl.getAllFriends)

module.exports = route
