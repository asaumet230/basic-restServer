const { request, response } = require("express");


const validarRole = (req= request, res = response, next) => {

    if(!req.usuarioAutenticado) {
        return res.status(500).json({
            msg: 'Se quiere validar el rol sin verificar el Token primero'
        });
    }

    const { role, nombre } = req.usuarioAutenticado;

    if( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no tiene permisos para esta operación`
        });
    }

    next();
}

//Forma alternativa si los usuarios que pueden borrar otro usuario tienen dos tipos de rol diferentes:
const tieneRol = (...roles) => {

    return (req= request, res = response, next) => {

        if(!req.usuarioAutenticado) {

            return res.status(500).json({
                msg: 'Se quiere validar el rol sin verificar el Token primero'
            });
        }

        const { role, nombre } = req.usuarioAutenticado;

        if( !roles.includes(role) ) {

            return res.status(401).json({
                msg: `${nombre} el usuario no esta autorizado, require uno de estos roles: ${roles}`
            });
        }

        next();
    }


}

module.exports = {
    validarRole,
    tieneRol
};