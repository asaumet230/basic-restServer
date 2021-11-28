const { validationResult } = require('express-validator');
const { response } = require('express');

const validacionCampos = async (req, res = response, next) => {

    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    next();

}

module.exports = {
    validacionCampos
};