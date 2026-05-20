const messageModel = require("../models/message.model");

const chatHandler = (io, socket) => {

    socket.on('join_conversation', (data) => {

        const { conversationId } = data

        if (conversationId) {
            socket.join(conversationId)
            console.log(`User ${socket.id} joined room: ${conversationId}`);
        }
    })

    socket.on('send_message', async (data) => {
        console.log('send message')
        const { conversationId, senderId, text } = data

        if (!text || text.trim() === '') return

        try {

            const newMessage = await messageModel.create({
                conversationId,
                sender: senderId,
                text
            })

            console.log(`User ${senderId} send message to user ${senderId} with ${text}`)

            io.to(conversationId).emit('receive_message', {
                _id: newMessage._id,
                conversationId: newMessage.conversationId,
                senderId: newMessage.sender,
                text: newMessage.text,
            })
        } catch (err) {
            console.log('Error when send message: ', err)
        }
    })
}

module.exports = chatHandler