const route = require('express').Router()
const chatCtl = require('../controllers/chat')

route.post('/create/:id', chatCtl.createChat)
route.patch('/edit/:id', chatCtl.updateChat)
route.patch('/read/:id', chatCtl.updateRead)
route.delete('/delete:id', chatCtl.deleteChat)
route.get('/colluctor/:id', chatCtl.getAllChatByColluctor)
route.get('/list/all', chatCtl.getAllListChat)
route.get('/detail/:id', chatCtl.getChatById)

module.exports = route
