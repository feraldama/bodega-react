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
  "producto",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, field: "ClienteId" },
    ClienteRUC: Sequelize.STRING,
    name: { type: Sequelize.STRING, field: "ClienteNombre" },
    lastname: { type: Sequelize.STRING, field: "ClienteApellido" },
    // salePrice: { type: Sequelize.BIGINT, field: "ProductoPrecioVenta" },
    address: { type: Sequelize.STRING, field: "ClienteDireccion" },
    telefono: { type: Sequelize.MEDIUMINT, field: "ClienteTelefono" },
    clienteTipo: { type: Sequelize.STRING, field: "ClienteTipo" },
    UsuarioId: { type: Sequelize.STRING, field: "UsuarioId" },
  },
  {
    tableName: "producto",
    timestamps: false, // Specify the table name here
  }
);

module.exports = clientes;
