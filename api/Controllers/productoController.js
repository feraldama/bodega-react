const productoModel = require("../Models/productoModel");
const comboModel = require("../Models/comboModel");
module.exports = {
  getProductos,
  getCombos,
};

async function getProductos(req, res) {
  try {
    const productos = await productoModel.findAll();

    // Enviar la respuesta al cliente
    res.status(200).json(productos); // Cambia el status y la respuesta según tus necesidades
  } catch (error) {
    console.log(error);

    // Enviar una respuesta de error al cliente
    res.status(500).json({ error: "Error al obtener los productos" }); // Puedes personalizar el mensaje de error
  }
}

async function getCombos(req, res) {
  try {
    const combos = await comboModel.findAll();

    // Enviar la respuesta al cliente
    res.status(200).json(combos); // Cambia el status y la respuesta según tus necesidades
  } catch (error) {
    console.log(error);

    // Enviar una respuesta de error al cliente
    res.status(500).json({ error: "Error al obtener los combos" }); // Puedes personalizar el mensaje de error
  }
}
