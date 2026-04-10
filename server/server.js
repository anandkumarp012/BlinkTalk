import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from "http";
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from "socket.io";



const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {origin : "*"}
})

export const userSocketMap = {};

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected: ", userId);

    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUser", Object.keys(userSocketMap));
    socket.on("disconnect", ()=>{
        console.log("User disconnected: ", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
    )
})




//  Middleware
// Temporarily allow all origins for debugging, or define the exact production frontend domains (Vercel, Netlify)
app.use(cors({
    origin: process.env.CLIENT_URL || true, // 'true' reflects the request origin, allowing all temporarily
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


// connect to MongoDB
await connectDB();

const rawPort = process.env.PORT ?? "5000";
const PORT = Number.parseInt(rawPort, 10);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    console.error(
        `Invalid PORT value: "${rawPort}". PORT must be a number between 1 and 65535. ` +
        `On Render, do not set PORT manually to a URL. Use CLIENT_URL for your frontend domain.`
    );
    process.exit(1);
}

server.on("error", (err) => {
    if (err.code === "EACCES") {
        console.error(
            `Port ${PORT} requires elevated privileges or is invalid for this environment. ` +
            `If deploying to Render, remove any manual PORT setting and let Render provide it.`
        );
    } else if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error("Server failed to start:", err);
    }
    process.exit(1);
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));