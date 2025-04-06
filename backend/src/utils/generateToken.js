import jwt from "jsonwebtoken";

export const generateToken = (id,res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('token', token, {
        httpOnly: true,
        // sameSite: "none",
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

}