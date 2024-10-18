import { configDotenv } from "dotenv";
import { createConnection } from "mongoose";
configDotenv();

const db = createConnection(process.env.DB_URI as string);

export default db;