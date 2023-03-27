// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

// configuring __dirname
import { fileURLToPath } from "url"
import { dirname } from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import express from "express"
import morgan from "morgan"
import passport from "passport"
import expressLayouts from "express-ejs-layouts"
import "express-async-errors"
import session from "express-session"

// Define routes
import { authRoute } from "./api/routes/authorizations.js"
import { aboutRoute } from "./api/routes/about.js"
import { profileRoute } from "./api/routes/profiles.js"
import { indexRoute } from "./api/routes/index.js"

// Define midllewares
import { notFoundMiddleware } from "./api/middleware/not-found.js"
import { authMiddleware } from "./api/middleware/authentication.js"

// Database MySQL connection
import { connection } from "./config/db.js"
connection.connect(function (error) {
  if (error) {
    console.error("error connecting: " + error.stack)
    return
  }
  console.log("Connected as ID " + connection.threadId)
})

const app = express()
const PORT = process.env.PORT || 5000

// Set the view engine to EJS
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Header thing
app.use((req, res, next) => {
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
app.use("/profile", authMiddleware, profileRoute)

// Error handlers
app.use(notFoundMiddleware)

// Partial
app.get("/partials", (req, res) => {})

// Start the server and listen for incoming requests on a specified port
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
