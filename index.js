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
import expressLayouts from "express-ejs-layouts"

// Define routes
import { authRoute } from "./api/routes/authorizations.js"
import { aboutRoute } from "./api/routes/about.js"
import { profileRoute } from "./api/routes/profiles.js"

const app = express()

// Connection to MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hospitaldb",
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
app.use(express.static(__dirname + "/public"))

app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ./api/routes
app.use("/auth", authRoute)
app.use("/about", aboutRoute)
app.use("/profile", profileRoute)

// Define a route for the root URL of the application
app.get("/", (req, res) => {
  res.render("index.ejs")
})

app.get("/register", (req, res) => {
  res.render("auth.ejs")
})

app.post("/register", (req, res) => {
  const { name, lastname, email, password } = req.body

  connection.query(
    "INSERT INTO users SET ?",
    {
      name: name,
      lastname: lastname,
      email: email,
      password: password,
    },
    (error, results) => {
      if (error) console.log(error)
      else {
        return res.render("auth.ejs")
      }
    }
  )
})

app.get("/test", (req, res) => {
  res.render("test.ejs")
})

// Start the server and listen for incoming requests on a specified port
app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err)

  console.log("Server is listening on " + process.env.PORT)
})
