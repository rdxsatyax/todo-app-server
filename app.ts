import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from "express";
import { router } from "./route/index";
import { sequelize } from "./models";
import logger from './logger';
const app: Application = express();
const port: number = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/", router);

// Database connection
const startServer = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("MySQL connection established successfully.");
        logger.info("MySQL connection established successfully.");

        await sequelize.sync();

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            logger.info(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to database:", error);
    }
};

startServer();
