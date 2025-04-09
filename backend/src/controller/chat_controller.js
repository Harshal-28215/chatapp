import formidable from "formidable"
import Chat from "../model/chat_model.js"
import User from "../model/user_model.js"
import { getReceiverSocketId, io } from "../socket.js"
import fs from "fs"
import sharp from "sharp"
import { imageUpload } from "../utils/imageupload.js"

export async function getUsers(req, res) {
    const logedinUserId = req.user._id
    try {
        const user = await User.find({ _id: { $ne: logedinUserId } }).select("-password")

        res.status(200).json({ message: "user fetched", data: user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export async function getUsersById(req, res) {
    const userId = req.params.id
    try {
        const user = await User.findById(userId).select("-password")


        res.status(200).json({ message: "user fetched by id", data: user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getMessage(req, res) {
    const userId = req.user._id
    const { id: receiverUserId } = req.params
    try {
        const messages = await Chat.find({
            $or: [
                { senderId: userId, receiverId: receiverUserId },
                { senderId: receiverUserId, receiverId: userId }
            ]
        })

        res.status(200).json({ message: "chat fetched", data: messages })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function sendMessage(req, res) {

    const form = formidable({ multiples: false })

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({ message: err.message })
        }
        const text = Array.isArray(fields.text) ? fields.text[0] : fields.text || "";
        const { id: receiverId } = req.params
        const senderId = req.user._id
        const file = files.image?.[0]


        try {

            if (!text && !file) {
                return res.status(400).json({ message: "text or image is required" })
            }

            let imageUrl;
            let fullimageUrl;
            if (file) {
                const originalBuffer = await fs.promises.readFile(file.filepath);

                const fullsizeBuffer = await sharp(originalBuffer).jpeg({ quality: 70 }).toBuffer()

                const result = await imageUpload(fullsizeBuffer, file.originalFilename);
                if (result) fullimageUrl = result.secure_url;
                if (fullimageUrl) imageUrl = fullimageUrl.replace('/upload/', '/upload/w_300,q_30/');
            }

            const newChat = new Chat({
                senderId,
                receiverId,
                text,
                image: fullimageUrl,
                coverImage: imageUrl
            })

            await newChat.save();

            const receiverSocketId = getReceiverSocketId(receiverId)
            const senderSocketId = getReceiverSocketId(senderId)

            if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newChat)
            if (senderSocketId) io.to(senderSocketId).emit("newMessage", newChat)

            res.status(200).json({ data: newChat })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })
}

export async function updateMessage(req, res) {
    const { id: messageId } = req.params
    const { rid: receiverId } = req.params
    const senderId = req.user._id

    const { text } = req.body
    try {
        const messages = await Chat.findByIdAndUpdate(messageId, { text: text }, { new: true })
        if (!messages) return res.status(404).json({ message: "message not found" })

        const receiverSocketId = getReceiverSocketId(receiverId)
        const senderSocketId = getReceiverSocketId(senderId)
        if (receiverSocketId) io.to(receiverSocketId).emit("updatedMessage", messages)
        if (senderSocketId) io.to(senderSocketId).emit("updatedMessage", messages)

        res.status(200).json({ message: "chat updated", data: messages })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function deleteMessage(req, res) {
    const { id: messageId } = req.params
    const { rid: receiverId } = req.params
    const senderId = req.user._id
    try {
        const messages = await Chat.findByIdAndDelete(messageId)
        if (!messages) return res.status(404).json({ message: "message not found" })

        const receiverSocketId = getReceiverSocketId(receiverId)
        const senderSocketId = getReceiverSocketId(senderId)

        if (receiverSocketId) io.to(receiverSocketId).emit("deletedMessage", messages)
        if (senderSocketId) io.to(senderSocketId).emit("deletedMessage", messages)

        res.status(200).json({ message: "chat deleted", data: messages })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}