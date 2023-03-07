// configuring .env
import { config } from "dotenv"
config({ path: ".env" })
import express from "express"
import mongoose from "mongoose"
import mysql from "mysql"

const app = express()
const PORT = process.env.PORT
const connection = mysql.createConnection(process.env.MYSQLPARAM)

// Connection to MySQL database
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack)
    return
  }
  console.log("connected as id " + connection.threadId)
})

// Set the view engine to EJS
app.set("view engine", "ejs")

// Mount the static middleware to serve static files in the public folder
app.use(express.json())
app.use(express.static("public"))

// Define a route for the root URL of the application
app.get("/", (req, res) => {
  res.render("index.ejs")
})

// Start the server and listen for incoming requests on a specified port
app.listen(PORT, (err) => {
  if (err) return console.log(err)

  console.log("Server is listening on " + PORT)
})
