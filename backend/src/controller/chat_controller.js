import formidable from "formidable"
import Chat from "../model/chat_model.js"
import User from "../model/user_model.js"
import cloudinary from "../utils/cloudinary.js"
import { getReceiverSocketId, io } from "../socket.js"

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
            if (file) {
                const uploadimage = await cloudinary.uploader.upload(file?.filepath, {
                    folder: "chat"
                });

                if(uploadimage) imageUrl = uploadimage.secure_url;
            }

            const newChat = new Chat({
                senderId,
                receiverId,
                text,
                image: imageUrl,
            })

            await newChat.save();

            const receiverSocketId = getReceiverSocketId(receiverId)
            if(receiverSocketId) io.to(receiverSocketId).emit("newMessage",newChat)

            res.status(200).json({ data: newChat })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })


}