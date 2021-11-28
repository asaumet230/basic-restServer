const { Router } = require('express');
const router = Router();

//Rutas:
const { usersGet, userPost, userPut, userDelete } = require('../controllers/user');


        //Ejemplos de GET, POST, PUT, DELETE:

        /*** GET ***/
        router.get('/', usersGet );

         /*** POST ***/
        router.post('/', userPost);

         /*** PUT ***/
        router.put('/:id', userPut);

        /*** DELETE ***/
        router.delete('/', userDelete);    

module.exports = router;