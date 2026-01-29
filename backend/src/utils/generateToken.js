import jwt from "jsonwebtoken";

export const generateToken = (id,res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: "true" ,
        secure:false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })


}


