
const { Server } = require('socket.io')
const redis = require('../config/redis.config')
const chatHandler = require('./chat.socket')

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId

        if (userId && userId !== 'undefined') {
            console.log(`User connected: ${userId} with socketId: ${socket.id}`);

            await redis.set(`user:socket:${userId}`, socket.id)

            socket.join(userId)

            chatHandler(io, socket)
        }

        socket.on('disconnect', async () => {
            if (userId) {
                console.log(`User disconnected: ${userId}`);
                await redis.del(`user:socket:${userId}`)
            }
        })
    })

    return io
}

module.exports = initSocket