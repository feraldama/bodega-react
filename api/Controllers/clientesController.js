const Clientes = require("../Models/clientesModel");
module.exports = {
  getClientes,
};

async function getClientes(req, res) {
  try {
    const clientes = await Clientes.findAll();

    // Enviar la respuesta al cliente
    res.status(200).json(clientes); // Cambia el status y la respuesta según tus necesidades
  } catch (error) {
    console.log(error);

    // Enviar una respuesta de error al cliente
    res.status(500).json({ error: "Error al obtener los clientes" }); // Puedes personalizar el mensaje de error
  }
}
