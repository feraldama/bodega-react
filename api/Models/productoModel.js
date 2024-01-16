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

const productoModel = sequelize.define(
  "producto",
  {
    ProductoId: { type: Sequelize.INTEGER, primaryKey: true },
    ProductoCodigo: Sequelize.BIGINT,
    ProductoNombre: Sequelize.STRING,
    ProductoPrecioVenta: Sequelize.BIGINT,
    ProductoPrecioUnitario: Sequelize.BIGINT,
    ProductoStock: Sequelize.MEDIUMINT,
    ProductoStockUnitario: Sequelize.MEDIUMINT,
    ProductoCantidadCaja: Sequelize.MEDIUMINT,
    ProductoStockMinimo: Sequelize.MEDIUMINT,
    ProductoPrecioVentaMayorista: Sequelize.BIGINT,
    ProductoIVA: Sequelize.SMALLINT,
  },
  {
    tableName: "producto",
    timestamps: false, // Specify the table name here
  }
);

module.exports = productoModel;
