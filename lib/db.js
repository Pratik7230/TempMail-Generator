import { User } from "@/app/entities/User";
import { DataSource } from "typeorm";
import "reflect-metadata";

const AppDataSource = new DataSource({
    type: "postgres",

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false,
    },

    entities: [User],
    synchronize: true,
});

export async function connectDB() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    return AppDataSource;
}