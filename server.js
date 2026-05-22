require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const { Server } = require('socket.io')
const connectDB = require('./src/config/db')
const initSocket = require('./src/sockets/socket');

connectDB()

const server = http.createServer(app)
const io = initSocket(server);

console.log("Danh sách tất cả các phòng:", io.sockets.adapter.rooms);

// require('./src/sockets/chat')

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log('Server is running ', PORT)
})