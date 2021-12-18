const  { request, response } = require('express');

const validarArchivo = ( req = request, res = response, next ) => {

      // Validar si viene algun archivo:
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {

        return res.status(400).json({
            msg: 'No hay ningun archivo en la petición'
        });
    }

    next();

}

module.exports = {
    validarArchivo
}