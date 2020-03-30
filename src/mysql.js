import AWS from "aws-sdk";
import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();
const ssm = new AWS.SSM();

const params = {
  Name: "config",
  WithDecryption: false
};

ssm.getParameter(params, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    const config = JSON.parse(data.Parameter.Value);

    const db = mysql.createConnection({
      host: "localhost",
      user: config.DB_USER,
      password: config.DB_PASSWORD,
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
  }
});
