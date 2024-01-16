const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bodega', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const productoModel = sequelize.define('producto',{
	'ProductoId':{type:Sequelize.INTEGER, primaryKey:true},
	'ProductoCodigo':Sequelize.BIGINT,
	'ProductoNombre': Sequelize.STRING,
	"ProductoPrecioVenta":Sequelize.BIGINT,
	"ProductoPrecioUnitario":Sequelize.BIGINT,
	"ProductoStock":Sequelize.MEDIUMINT,
	"ProductoStockUnitario":Sequelize.MEDIUMINT,
	"ProductoCantidadCaja":Sequelize.MEDIUMINT,
	"ProductoStockMinimo":Sequelize.MEDIUMINT,
	"ProductoPrecioVentaMayorista":Sequelize.BIGINT,
	"ProductoIVA":Sequelize.SMALLINT,

}, {
    tableName: 'producto',
	timestamps: false, // Specify the table name here
}); 

module.exports = productoModel;