const express = require("express");
const Sequelize = require("sequelize");
require("dotenv").config();

const app = express();

const {
  REACT_APP_DB_USER,
  REACT_APP_DB_PASSWORD,
  REACT_APP_DB_HOST,
  REACT_APP_DB_NAME,
} = process.env;

const sequelize = new Sequelize(
  REACT_APP_DB_NAME,
  REACT_APP_DB_USER,
  REACT_APP_DB_PASSWORD,
  {
    host: REACT_APP_DB_HOST,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("CONEXION OK");
  })
  .catch((error) => {
    console.log("error: " + error);
  });

//config Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes"));

module.exports = app;
