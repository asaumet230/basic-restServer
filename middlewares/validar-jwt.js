const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');

const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token, permiso no válido'
        });
    }

    try {

        const { uid } = await jwt.verify(token, process.env.SECRET_JWT_SEED);
        const usuarioAutenticado = await Users.findById({ _id: uid });

        //Verifica si el usuario existe aunque el token sea valido:
        if(!usuarioAutenticado) {
            return res.status(401).json({
                msg:'Token no válido'            
            });
        }

        //Verifica que el usuario tenga estado= true, aunque el token sea valido:
        if(!usuarioAutenticado.estado) {
            return res.status(401).json({
                msg:'Token no válido'            
            });
        }

        //Se crea en el objeto la propiedad que tenga la información del usuario autenticado:
        req.usuarioAutenticado = usuarioAutenticado;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Error token no válido'
        });
    }




}

module.exports = {
    validarJWT
};