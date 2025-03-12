import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: false, 
});

const connectPostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL Connected...");
    } catch (error) {
        console.error("PostgreSQL Connection Failed:", error);
        process.exit(1);
    }
};



export { sequelize, connectPostgres };
