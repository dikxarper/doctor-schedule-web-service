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
import cookieParser from "cookie-parser"
import expressLayouts from "express-ejs-layouts"
import "express-async-errors"
import session from "express-session"
import passport from "passport"

// Define routes
import { authRoute } from "./api/routes/authorizations.js"
import { profileRoute } from "./api/routes/profiles.js"
import { indexRoute } from "./api/routes/index.js"
import { adminRoute } from "./api/routes/admin.js"

// Define midllewares
import { notFoundMiddleware } from "./api/middleware/not-found.js"

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

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Cookie Parser
app.use(cookieParser())

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Mount the static middleware to serve static files in the public folder
app.use(express.static(__dirname + "/public"))

app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// test route
app.get("/test", (req, res) => {
  res.render("test")
})

app.locals.user = {
  id: null,
}
// ./api/routes
app.use("/", indexRoute)
app.use("/auth", authRoute)
app.use("/profile", profileRoute)
app.use("/admin", adminRoute)

// Error handlers
app.use(notFoundMiddleware)

// Partial
app.get("/partials", (req, res) => {})

// Start the server and listen for incoming requests on a specified port
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
