const router = require('express').Router();

router.get('/', (req,res) => {
	res.send('Todo OK');
})

module.exports = router; 