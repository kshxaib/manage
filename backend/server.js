import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";

const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/healthcheck", (req, res) => {
    res.status(200).json({ success: true, message: "Manage API is running" });
});


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
