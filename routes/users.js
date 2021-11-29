const { Router } = require('express');
const { check } = require('express-validator');

const { validacionCampos } = require('../middlewares/validar-campos');
const { esRolValido, emailExiste } = require('../helpers/db-validators');

const router = Router();

//Rutas:
const { usersGet, usersPost, usersPut, usersDelete } = require('../controllers/user');


        //Ejemplos de GET, POST, PUT, DELETE:

        /*** GET ***/
        router.get('/',usersGet );

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
        router.put('/:id', usersPut);

        /*** DELETE ***/
        router.delete('/', usersDelete);    

module.exports = router;