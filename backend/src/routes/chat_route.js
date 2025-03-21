import express from 'express';
import { authUser } from '../middelware/user_middelware.js';
import { getMessage, getUsers, getUsersById, sendMessage } from '../controller/chat_controller.js';


const router = express.Router();

router.get('/users',authUser,getUsers)
router.get('/users/:id',authUser,getUsersById)
router.get('/:id',authUser,getMessage)
router.post('/sendmessage/:id',authUser,sendMessage)

export default router