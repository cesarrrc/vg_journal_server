const mysql = require("mysql");
require("dotenv").config();

class Connection {
  constructor() {
    if (!this.pool) {
      console.log("creating connection pool...");
      this.pool = mysql.createPool({
        connectionLimit: 100,
        host: process.env.HOST_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
      });

      return this.pool;
    }

    return this.pool;
  }
}

const instance = new Connection();

module.exports = instance;
