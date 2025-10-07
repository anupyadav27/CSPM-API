import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use((req, res) => {
	res.status(404).json({error: "Route not found"});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({error: "Something went wrong!"});
});

export default app;
