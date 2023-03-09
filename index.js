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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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

app.get("/auth", (req,res) =>{
  res.render("auth.ejs")
})
app.get("/reg", (req,res) =>{
  res.render("reg.ejs")
})


app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE IIN = ? AND Password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/about');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/about', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// Start the server and listen for incoming requests on a specified port
app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err)

  console.log("Server is listening on " + process.env.PORT)
})
