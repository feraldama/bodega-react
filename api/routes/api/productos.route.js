const router = require('express').Router();
const productoController = require('../../Controllers/productoController')
router.get('/', productoController.getProductos)

module.exports = router; 