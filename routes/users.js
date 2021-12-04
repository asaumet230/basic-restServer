const { Router } = require('express');
const { check } = require('express-validator');

//middlewares:
const { validacionCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRole, tieneRol } =require('../middlewares/validar-roles');

//helpers
const numberValidator = require('../helpers/number-validator');

const { esRolValido, 
        emailExiste,
        existeUsuarioPorID } = require('../helpers/db-validators');


//controllers:
const { usersGet, 
        usersPost, 
        usersPut, 
        usersDelete } = require('../controllers/user');

        const router = Router();

        //Ejemplos de GET, POST, PUT, DELETE:

        /*** GET ***/
        router.get('/',[
                check('limite').custom( limite => numberValidator( limite )),
                check('desde').custom( desde => numberValidator( desde )),
                validacionCampos
        ], usersGet );

         /*** POST ***/
        router.post('/', [

                check('nombre', 'El campo nombre debe ser obligatorio').not().isEmpty(),
                check('email', 'Email con formato no valido').isEmail(),
                check('email').custom( email => emailExiste(email) ),
                check('password', 'El password debe tener minímo 6 caracteres').isLength({ min: 6 }).not().isEmpty(),
                // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), esta validación no se hace como se hizo en angular avanzado ni como esta es contrastando contra una colección de la BD.
                check('role').custom( role => esRolValido(role) ),
                validacionCampos

        ], usersPost);

         /*** PUT ***/
        router.put('/:id', [

                check('id', 'No es un id Válido').isMongoId(),
                check('id').custom( id => existeUsuarioPorID(id) ),
                check('role').custom( role => esRolValido(role) ),
                validacionCampos

        ], usersPut);

        /*** DELETE ***/
        router.delete('/:id', [
                
                validarJWT,
                // validarRole,
                tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
                check('id', 'No es un id Válido').isMongoId(),
                check('id').custom( id => existeUsuarioPorID(id) ),
                validacionCampos

        ], usersDelete);    

module.exports = router;