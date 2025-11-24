import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import initModels from "../models/init-models.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: process.env.DB_LOGGING === "true",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

sequelize.beforeConnect((config) => {
    config.dialectOptions = {
        ...config.dialectOptions,
        context: {},
    };
});

sequelize.addHook("afterConnect", async (connection) => {
    const schema = "cspm";

    await connection.query(`SET search_path TO ${schema};`);
});

const models = initModels(sequelize);

export { sequelize, models };
