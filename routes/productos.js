const { Router } = require('express');
const { check } = require('express-validator');

//Controllers:
const { obtenerProductos } = require('../controllers/productos');

//Hepers:


const router = Router();

router.get('/', obtenerProductos );




module.exports = router;