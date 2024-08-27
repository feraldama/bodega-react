const router = require("express").Router();
const ventaController = require("../../Controllers/ventaController");
router.post("/", ventaController.postVenta);

module.exports = router;
