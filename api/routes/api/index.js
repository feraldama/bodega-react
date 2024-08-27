//RUTAS API
const router = require("express").Router();

router.use("/clientes", require("./clientes.route"));
router.use("/venta", require("./venta.route"));
router.use("/productos", require("./productos.route"));
router.use("/usuarioLogueado", require("./usuarioLogueado.route"));

module.exports = router;
