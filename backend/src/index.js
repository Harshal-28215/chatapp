import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectToMongo from './db.js';
import cookieParser from 'cookie-parser';
import user_route from './routes/user_route.js'
import chat_router from './routes/chat_route.js'
import { app, server } from './socket.js';
import path from 'path';

dotenv.config();

connectToMongo();

const port = 5000
const __dirname = path.resolve();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173','https://chatapp-liart-iota.vercel.app',"https://chatappf.onrender.com"],
  credentials: true,
}));

app.use(express.json())

app.use('/auth', user_route)
app.use('/chat', chat_router)

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));

//   app.get('*', (req, res) => {
//     if (req.originalUrl.startsWith('/chat')) {
//       return;
//     }
//     res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
//   })
// }

server.listen(port, () => {
  console.log("Server ready on port 5000.");
})