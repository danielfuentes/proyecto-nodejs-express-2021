const express = require('express');
const router = express.Router();
const path = require('path');

//Requerir el modulo de los controladores
const webController = require(path.resolve(__dirname, '../controllers/webController'));

// Métodos en nuestros controladores: index - show - edit - delete 
router.get('/', webController.index);
router.get('/nosotros', webController.nosotros);

module.exports = router;
