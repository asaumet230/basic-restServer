const { Router } = require('express');
const { check } = require('express-validator');

const { validacionCampos } = require('../middlewares/validar-campos');

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
                check('password', 'El password debe tener minímo 6 caracteres').isLength({ min: 6 }).not().isEmpty(),
                check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
                validacionCampos

        ], usersPost);

         /*** PUT ***/
        router.put('/:id', usersPut);

        /*** DELETE ***/
        router.delete('/', usersDelete);    

module.exports = router;