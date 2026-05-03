const http = require('http')
const app = require('./src/app')
const { Server } = require('socket.io')
const connectDB = require('./src/config/db')
require('dotenv').config()

connectDB()

const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' }
})

// require('./src/sockets/chat')

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log('Server is running ', PORT)
})