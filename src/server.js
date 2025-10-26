import app from "./app.js";
import connectMongoDB from "./config/mongodb.js";
import "dotenv/config";

const PORT = 5000;
const DB_IN_USE = process.env.DB_IN_USE?.toLowerCase();

async function startServer() {
    try {
        if (DB_IN_USE === "mongodb") {
            await connectMongoDB;
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
