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

const comboModel = sequelize.define(
  "combo",
  {
    ComboId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: "ComboId",
    },
    ComboDescripcion: Sequelize.STRING,
    ProductoId: Sequelize.INTEGER,
    ComboCantidad: Sequelize.MEDIUMINT,
    ComboPrecio: Sequelize.BIGINT,
  },
  {
    tableName: "combo",
    timestamps: false, // Specify the table name here
  }
);

module.exports = comboModel;
