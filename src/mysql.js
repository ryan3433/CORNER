import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "mozo"
});

db.connect(err => {
  if (err) {
    console.error(`error connecting : ${err.stack}`);
    return;
  }
  console.log(`✅ connected as id ${db.threadId}`);
});

export default db;
