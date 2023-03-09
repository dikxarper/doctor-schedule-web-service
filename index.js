// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

// configuring __dirname
import { fileURLToPath } from "url"
import { dirname } from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import express from "express"
import mysql from "mysql"

const app = express()

// Connection to MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
})

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack)
    return
  }
  console.log("Connected as ID " + connection.threadId)
})

// Set the view engine to EJS
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")

// Mount the static middleware to serve static files in the public folder
app.use("/css", express.static(__dirname + "public/css"))
app.use("/img", express.static(__dirname + "public/img"))
app.use("/js", express.static(__dirname + "public/js"))
app.use(express.json())
app.use(express.static("public"))

// Define a route for the root URL of the application
app.get("/", (req, res) => {
  res.render("index.ejs")
})

// Start the server and listen for incoming requests on a specified port
app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err)

  console.log("Server is listening on " + process.env.PORT)
})
