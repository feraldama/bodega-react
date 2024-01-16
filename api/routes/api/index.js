//RUTAS API
const router = require('express').Router();

router.use('/ventas', require('./ventas.route'))
router.use('/productos', require('./productos.route'))

module.exports = router; 