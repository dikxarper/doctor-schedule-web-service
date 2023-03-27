// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import mysql2 from "mysql2"

// Connection to MySQL database
const connection = mysql2.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

export { connection }
