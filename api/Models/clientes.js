const { Sequelize } = require("sequelize");
require("dotenv").config();

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

const clientes = sequelize.define(
  "clientes",
  {
    ClienteId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: "ClienteId",
    },
    ClienteRUC: Sequelize.STRING,
    ClienteNombre: Sequelize.STRING,
    ClienteApellido: Sequelize.STRING,
    ClienteDireccion: Sequelize.STRING,
    ClienteTelefono: Sequelize.STRING,
    ClienteTipo: Sequelize.STRING,
  },
  {
    tableName: "clientes",
    timestamps: false, // Specify the table name here
  }
);

module.exports = clientes;
