const express = require("express");
const app = express();
const path = require("path");
const PORT = require("./config");
const routes = require("./routes");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");

//DB connection
const dbUrl = "mongodb+srv://ljimena:1phzFdJlCHL09DNs@cluster0.d02hn1u.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión a MongoDB exitosa!");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use("/", routes);


app.listen(PORT, () => {
  console.log(`¡La aplicación está escuchando en el puerto ${PORT}!`);
});
