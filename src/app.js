import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use((req, res) => {
    console.warn("Route not found:", req.originalUrl);
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res) => {
    console.error("SERVER ERROR:", err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

export default app;
