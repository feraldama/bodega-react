const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const productoModel = require("./Models/productoModel");
const sequelize = new Sequelize("bodegasalvatore", "sa", "paloma", {
  host: "localhost",
  dialect: "mysql",
});

// const productoModel = sequelize.define('producto',{
// 	'ProductoId':{type:Sequelize.INTEGER, primaryKey:true},
// 	'ProductoCodigo':Sequelize.BIGINT,
// 	'ProductoNombre': Sequelize.STRING,
// 	"ProductoPrecioVenta":Sequelize.BIGINT,
// 	"ProductoPrecioUnitario":Sequelize.BIGINT,
// 	"ProductoStock":Sequelize.MEDIUMINT,
// 	"ProductoStockUnitario":Sequelize.MEDIUMINT,
// 	"ProductoCantidadCaja":Sequelize.MEDIUMINT,
// 	"ProductoStockMinimo":Sequelize.MEDIUMINT,
// 	"ProductoPrecioVentaMayorista":Sequelize.BIGINT,
// 	"ProductoIVA":Sequelize.SMALLINT,

// }, {
//     tableName: 'producto',
// 	timestamps: false, // Specify the table name here
// });

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
