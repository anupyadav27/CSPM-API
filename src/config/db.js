import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import initModels from "../models/init-models.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    schema: process.env.DB_SCHEMA,
    logging: process.env.DB_LOGGING === "true",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

const models = initModels(sequelize);

export { sequelize, models };
