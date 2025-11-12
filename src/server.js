import app from "./app.js";
import { sequelize } from "./config/db.js";
import "dotenv/config";

const PORT = process.env.PORT || 5000;
const DB_IN_USE = process.env.DB_IN_USE?.toLowerCase();

async function startServer() {
    try {
        if (DB_IN_USE === "postgres") {
            await sequelize.authenticate();
            console.log("✅ PostgreSQL connected");

            await sequelize.sync();
            console.log("✅ Models initialized and synced");
        } else {
            throw new Error("Invalid DB_IN_USE value. Must be 'mongodb' or 'postgres'");
        }

        app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    } catch (err) {
        console.error("Startup error:", err.message);
        process.exit(1);
    }
}

startServer();
