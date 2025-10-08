import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(cors(
	{
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
	}
));


app.use("/api/auth", authRoutes);

app.use((req, res) => {
	res.status(404).json({error: "Route not found"});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({error: "Something went wrong!"});
});

export default app;
