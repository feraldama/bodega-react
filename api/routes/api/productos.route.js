const router = require("express").Router();
const productoController = require("../../Controllers/productoController");
router.get("/", productoController.getProductos);
router.get("/combos", productoController.getCombos);

module.exports = router;
