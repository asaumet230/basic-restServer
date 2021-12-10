const { Router } = require('express');
const { check } = require('express-validator');


//Middlewares:
const { validacionCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRole } = require('../middlewares/validar-roles');

//Controllers:
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');

//Helpers:
const numberValidator = require('../helpers/number-validator');
const { existeCategoriaID } = require('../helpers/db-validators');


const router = Router();


//Obtiene todas las categorías - público:
router.get('/', [
    
    check('limite', ).custom( numberValidator ),
    check('desde', ).custom( numberValidator ),
    validacionCampos

], obtenerCategorias);

//Obtiene una categoría en especifico - público:
router.get('/:id', [

    check('id', 'Debe ser un id valido').isMongoId(),
    check('id').custom( existeCategoriaID ),
    validacionCampos

], obtenerCategoria);


//Crea categoría - privado cualquier rol con token válido:
router.post('/', [

    validarJWT,
    check('nombre', 'El nombre es obligatorío').not().isEmpty(),
    validacionCampos

],  crearCategoria );


//Actualiza categoría - privado cualquier rol con token válido:
router.put('/:id', [

    validarJWT,
    check('id', 'Debe ser un id valido').isMongoId(),
    check('id').custom( existeCategoriaID ),
    check('nombre', 'El nombre es obligatorío').not().isEmpty(),
    validacionCampos

], actualizarCategoria );

//Borra categoría - privado cualquier solo con rol: ADMIN:
router.delete('/:id',[

    validarJWT,
    validarRole,
    check('id', 'Debe ser un id valido').isMongoId(),
    check('id').custom( existeCategoriaID ),
    validacionCampos

], borrarCategoria );

module.exports = router;