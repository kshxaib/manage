import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js"
import clientRouter from "./routes/client.route.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}))

app.get("/healthcheck", (req, res) => {
    res.status(200).json({ success: true, message: "Manage API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/clients", clientRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB(process.env.MONGO_DB_URI);
    console.log(`Server is running on port ${PORT}`);
});
