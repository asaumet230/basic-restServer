const { Router } = require('express');
const { check } = require('express-validator');

//Middlewares:
const { validacionCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-roles');

//Controllers:
const { obtenerProductos, 
        obtenerProducto, 
        crearProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');

//Hepers:
const numberValidator = require('../helpers/number-validator');
const { existeCategoriaID, existeProductoID } = require('../helpers/db-validators');



const router = Router();

// Obtener Productos - Publico:
router.get('/',[

    check('limite').custom( numberValidator ),
    check('desde').custom( numberValidator ),
    validacionCampos
    
], obtenerProductos );

// Obtener Producto - Publico: 
router.get('/:id', [

    check('id', 'El Id no es valido').isMongoId(),
    check('id').custom( existeProductoID ),
    validacionCampos

], obtenerProducto);

// Crear Producto:
router.post('/', [

    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('referencia', 'La referencia es obligatoria').not().isEmpty(),
    check('precio', 'ingrese un valor valido').isNumeric(),
    check('precio').custom( numberValidator ),
    check('cantidad', 'ingrese un valor valido').isNumeric(),
    check('cantidad').custom( numberValidator ),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'Ingrese un id valido').isMongoId(),
    check('categoria').custom( existeCategoriaID ),
    validacionCampos
    

], crearProducto);

// Actualiza Producto - Privada Rol con token valido:
router.put('/:id', [
    
    validarJWT,
    check('precio', 'ingrese un valor valido').isNumeric(),
    check('precio').custom( numberValidator ),
    check('cantidad', 'ingrese un valor valido').isNumeric(),
    check('cantidad').custom( numberValidator ),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'Ingrese un id valido').isMongoId(),
    check('categoria').custom( existeCategoriaID ),
    check('id', 'El Id no es valido').isMongoId(),
    check('id').custom( existeProductoID ),
    validacionCampos

], actualizarProducto);

// Borra Producto - Privada Rol de Administrador o de ventas:
router.delete('/:id', [

    validarJWT,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'El Id no es valido').isMongoId(),
    check('id').custom( existeProductoID ),

    validacionCampos

], borrarProducto);






module.exports = router;