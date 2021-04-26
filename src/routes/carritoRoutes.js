var express = require('express');
var router = express.Router();
//Aquí llamo al middleware de autenticación. De esta forma aseguro que sólo el usuario logueado pueda ingresar productos al carrito de compras
const authMiddleware = require('../middlewares/auth');

//Aqui incorporo el middleware que se encarga de validar que la cantidad de productos a incluir al carrito no sea cero
const validador = require('../middlewares/validador');


// ************ Controller Require ************
const carritoController = require('../controllers/carritoController');

router.post('/carrito/adicionarAlCarrito', authMiddleware, validador.addCart, carritoController.addCart);
router.get('/carrito', authMiddleware, carritoController.cart);
router.post('/carrito/borrarElementoCarrito', authMiddleware, carritoController.deleteCart);
router.post('/carrito/compra', authMiddleware, carritoController.shop);
router.get('/carrito/historialCompra', authMiddleware, carritoController.history);
router.get('/carrito/detalleCompra/:id', authMiddleware, carritoController.buyDetail);

module.exports = router;

