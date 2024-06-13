const router = require("express").Router();
const clientesController = require("../../Controllers/clientesController");
router.get("/", clientesController.getClientes);

module.exports = router;
