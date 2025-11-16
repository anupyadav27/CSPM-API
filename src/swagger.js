import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API Documentation",
            version: "1.0.0",
            description: "Express + Sequelize + PostgreSQL API documentation",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server",
            },
        ],
    },

    apis: [path.join(__dirname, "./routes/*.js"), path.join(__dirname, "./models/*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📘 API docs available at /api-docs");
};
