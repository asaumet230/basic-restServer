const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares:
const { validacionCampos  } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarArchivo } = require('../middlewares/validar-archivo');

// Controllers:
const { cargarArchivo, actualizarImagen, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads');

const router = Router();


router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [

    validarJWT,
    validarArchivo,
    check('coleccion', 'La colección no es valida debe de ser: users o productos').isIn([ 'users', 'productos' ]),
    check('id', 'No es un Id valido').isMongoId(),
    validacionCampos

], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    
    check('coleccion', 'La colección no es valida debe de ser: users o productos').isIn([ 'users', 'productos' ]),
    check('id', 'No es un Id valido').isMongoId(),
    validacionCampos

], mostrarImagen);

module.exports = router;