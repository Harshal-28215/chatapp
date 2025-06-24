import User from "../model/user_model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";
import formidable from "formidable";
import fs from "fs";
import { io } from "../socket.js";

export async function signUp(req, res) {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) return res.status(400).json({ message: 'All fields are required' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword, name });

        let userResponse = {};

        if (user) {
            generateToken(user._id, res)

            userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
            }

            io.emit("newUser",userResponse)

            await user.save();
        }

        res.status(201).json({ message: 'signup successful', data: userResponse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User does not exist' });



        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        generateToken(user._id, res);

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
        }

        res.json({ message: 'login successful', data: userResponse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            secure: process.env.NODE_ENV !== "development",
          });
        res.status(200).json({ message: 'logout successfully' })
    } catch (error) {
        res.status(500).json({ message: error.massage })
    }
}

export async function profile(req, res) {

    const from = formidable({ multiples: false });

    from.parse(req, async (err, fields, files) => {

        const userId = req.user._id
        const file = files.profilePic?.[0];


        try {
            if (!file) return res.status(404).json({ message: "image is require" })

            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: "profile_pictures",
            });

            const updatedProfile = await User.findByIdAndUpdate(
                userId,
                { profilePic: result.secure_url },
                { new: true }
            );

            fs.unlinkSync(file.filepath);

            res.status(200).json({ message: "profile updated successfully", data: updatedProfile })
        } catch (error) {
            res.status(500).json({ message: error.massage })
        }
    })
}

export async function checkUser(req, res) {
    try {
        res.json({ message: "user logedin", data: req.user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}