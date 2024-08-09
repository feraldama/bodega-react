const router = require("express").Router();
const clientesController = require("../../Controllers/usuarioLogueado");
router.get("/", clientesController.getUser);

module.exports = router;
