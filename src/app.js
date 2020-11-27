const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const response = require('./helpers/response')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const server = require('http').createServer(app)
const io = require('socket.io')(server, {})
module.exports = io

app.get('/', (req, res) => {
  return (response(res, 'Backend for CONNECT app chat with us!'))
})

// auth middleware
const authUser = require('./middlewares/auth')

// user route
const userRoute = require('./routes/user')
app.use('/user', userRoute)

// auth route
const authRoute = require('./routes/auth')
app.use('/auth', authRoute)

// chat route
const chatRoute = require('./routes/chat')
app.use('/chat', authUser, chatRoute)

// friend route
const friendRoute = require('./routes/friend')
app.use('/friend', authUser, friendRoute)

// static folder access
app.use('/Uploads', express.static('./Assets/Public/Uploads'))

server.listen(process.env.APP_PORT, () => {
  console.log(`App listening on port ${process.env.APP_PORT}`)
})

