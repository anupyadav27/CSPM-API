import app from "./app.js";
import connectMongoDB from "./config/mongodb.js";
import connectDynamoDB from "./config/dynamodb.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000;
const DB_IN_USE = process.env.DB_IN_USE?.toLowerCase();

async function startServer() {
	try {
		if (DB_IN_USE === "mongodb") {
			await connectMongoDB;
		} else if (DB_IN_USE === "dynamodb") {
			connectDynamoDB;
		} else {
			throw new Error("Invalid DB_IN_USE value");
		}
		
		app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
	} catch (err) {
		console.error("Startup error:", err.message);
		process.exit(1);
	}
}

startServer();
