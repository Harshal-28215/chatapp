import express from 'express';
import { checkUser, login, logout, profile, signUp } from '../controller/user_controller.js';
import { authUser } from '../middelware/user_middelware.js';


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

router.put('/profile', authUser,profile);
router.get('/check',authUser, checkUser);

export default router;