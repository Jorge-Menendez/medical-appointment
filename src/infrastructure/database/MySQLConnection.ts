import mysql from 'mysql2/promise';
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USER} from "../../config/constants";

export const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    port: 3306,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectTimeout: 10000,
    queueLimit: 0
});
