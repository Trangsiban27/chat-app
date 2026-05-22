const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");

const chatHandler = (io, socket) => {

    socket.on('join_conversation', (data) => {

        const { conversationId } = data

        if (conversationId) {
            socket.join(conversationId.toString())
            console.log(`User ${socket.id} joined room: ${conversationId}`);
        }
    })

    socket.on('send_message', async (data) => {
        console.log('send message')
        const { conversationId, senderId, text, media } = data

        if (!text || text.trim() === '') return

        try {

            const newMessage = await messageModel.create({
                conversationId,
                sender: senderId,
                text,
                media: media || []
            })

            console.log(`User ${senderId} send message to user ${senderId} with ${text}`)

            await conversationModel.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage?._id
            })

            const clientsInRoom = io.sockets.adapter.rooms.get(conversationId.toString());
            console.log(`Emit tới phòng ${conversationId.toString()}. Hiện có ${clientsInRoom?.size || 0} kết nối trong phòng.`);

            const messageData = newMessage.toObject();

            io.to(conversationId.toString()).emit('receive_message', {
                ...messageData,
                senderId: messageData.sender
            })

            io.to(conversationId.toString()).emit('update_conversation_list', {
                conversationId,
                lastMessage: newMessage
            })
        } catch (err) {
            console.log('Error when send message: ', err)
        }
    })

    socket.on('mark_as_read', async ({ conversationId, userId }) => {
        try {

            await messageModel.updateMany(
                {
                    conversationId,
                    sender: { $ne: userId },
                    isRead: false
                },
                { $set: { isRead: true } }
            )

            socket.to(conversationId).emit('messages_seen', { conversationId, userId })

        } catch (err) {
            console.log('Mark as read error: ', err)
        }
    })
}

module.exports = chatHandler