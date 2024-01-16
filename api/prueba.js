const mongoose = require('mongoose');
const Venta = require('./models/ventas.models');
console.log('asdf');
(async () => {
	await mongoose.connect('mongodb://127.0.0.1/bodega');
console.log('asdfasa');
	const newVenta = await Venta.create({
		name:"prueba"
	})
	console.log(newVenta);
})