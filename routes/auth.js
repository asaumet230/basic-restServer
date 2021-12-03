const { Router } = require('express');
const { check } = require('express-validator');

//middlewares:
const { validacionCampos } = require('../middlewares/validar-campos');

//Controllers:
const { login } = require('../controllers/auth');


const router = Router()

router.post('/login', [
    check('email', 'Email con formato no valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validacionCampos
],
login);


module.exports = router;