import dotenv from "dotenv";
dotenv.config(); 

import express from "express";

import cors from "cors";

import {
    connectDB
} from "../db/connectdb.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON bodies
app.set('trust proxy', true); // trust proxy for ip address 
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization","cookie"],
        credentials: true,
    })
)

app.get("/health", (req, res) => {
	res.status(200).json({ message: "Server is healthy" });
});

app.get("/ip",(req,res)=>{
    const ip = req.ip || req.connection.remoteAddress;
    res.json({ ip });
});

app.get("/ping",(req,res)=>{
	const start = Date.now();
    res.json({ message: 'Pong', latency: `${Date.now() - start}ms` });
});

// catch all route - must be placed after all other routes
app.all("*", (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
    connectDB();
	console.log(`Server is running on port ${PORT}`);
});
