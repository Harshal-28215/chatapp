import jwt from 'jsonwebtoken'
import User from '../model/user_model.js'

export const authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: 'Unauthorized - token not provided' })

        const jwtverify = jwt.verify(token, process.env.JWT_SECRET)
        if (!jwtverify) return res.status(401).json({ message: 'Unauthorized - invalid token' })

        const user = await User.findById(jwtverify.id).select('-password')
        if(!user) return res.status(401).json({ message: 'Unauthorized - user not found' })

        req.user = user
        next()

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// export const authorizeUser = async (req, res, next) => {

// }