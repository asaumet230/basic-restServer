const { Router } = require('express');
const { check } = require('express-validator');

//middlewares:
const { validacionCampos } = require('../middlewares/validar-campos');

//Controllers:
const { login, googleSignIn } = require('../controllers/auth');


const router = Router()

router.post('/login', [
    check('email', 'Email con formato no valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validacionCampos
],
login);

router.post('/google', [
    check('id_token', 'El token de google es obligatorio').not().isEmpty(),
    validacionCampos
], googleSignIn )


module.exports = router;