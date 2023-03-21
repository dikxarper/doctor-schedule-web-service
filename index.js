// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

// configuring __dirname
import { fileURLToPath } from "url"
import { dirname } from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import express from "express"
import expressLayouts from "express-ejs-layouts"
import session from "express-session"

// Define routes
import { authRoute } from "./api/routes/authorizations.js"
import { aboutRoute } from "./api/routes/about.js"
import { profileRoute } from "./api/routes/profiles.js"
import { indexRoute } from "./api/routes/index.js"

// Define midllewares
import { notFoundMiddleware } from "./api/middleware/not-found.js"
import { errorMiddleware } from "./api/middleware/error-handler.js"

// Database MySQL connection
import { connection } from "./api/db/connect.js"
connection.connect(function (error) {
  if (error) {
    console.error("error connecting: " + error.stack)
    return
  }
  console.log("Connected as ID " + connection.threadId)
})

const app = express()

// Set the view engine to EJS
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
)

app.use((req, res, next) => {
  console.log(req.session.user_id)
  res.locals.session = req.session
  next()
})
// Mount the static middleware to serve static files in the public folder
app.use(express.static(__dirname + "/public"))

app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ./api/routes
app.use("/", indexRoute)
app.use("/auth", authRoute)
app.use("/about", aboutRoute)
app.use("/profile", profileRoute)

// Midllewares
app.use(errorMiddleware)
app.use(notFoundMiddleware)

// POST register
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
        return res.render("auth")
      }
    }
  )
})

// Partial
app.get("/partials", (req, res) => {})

// Start the server and listen for incoming requests on a specified port
app.listen(process.env.PORT, (error) => {
  if (error) return console.log(error)

  console.log("Server is listening on " + process.env.PORT)
})
