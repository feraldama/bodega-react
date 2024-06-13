//RUTAS API
const router = require("express").Router();

router.use("/clientes", require("./clientes.route"));
router.use("/productos", require("./productos.route"));

module.exports = router;
