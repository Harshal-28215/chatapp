import express from 'express';
import { authUser } from '../middelware/user_middelware.js';
import { deleteMessage, getMessage, getUsers, getUsersById, sendMessage, updateMessage } from '../controller/chat_controller.js';


const router = express.Router();

router.get('/users',authUser,getUsers)
router.get('/users/:id',authUser,getUsersById)
router.get('/:id',authUser,getMessage)
router.post('/sendmessage/:id',authUser,sendMessage)
router.put('/updatemessage/:id/:rid',authUser,updateMessage)
router.delete('/deletemessage/:id/:rid',authUser,deleteMessage)

export default router