module.exports = {
  getUser,
};

async function getUser(req, res) {
  try {
    const usuario = "Usuario Logueado: faldama";

    // Enviar la respuesta al cliente
    res.status(200).json(usuario); // Cambia el status y la respuesta según tus necesidades
  } catch (error) {
    console.log(error);

    // Enviar una respuesta de error al cliente
    res.status(500).json({ error: "Error al obtener el usuario logueado" }); // Puedes personalizar el mensaje de error
  }
}
