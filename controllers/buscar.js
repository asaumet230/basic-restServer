const { request, response } = require("express");


// Helpers:
const { buscarUsuario, buscarCategoria, buscarProducto } = require('../helpers/buscar-functions');

const coleccionesPermitidas = [
    'users',
    'categorias',
    'productos',
    'roles'
];


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion) ) {

        return res.status(401).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    try {

        switch (coleccion) {

            case 'users':
               buscarUsuario(termino, res);
               break;

            case 'categorias':
               buscarCategoria(termino, res);
               break;
            
            case 'productos':
                buscarProducto(termino, res);
                break;
        
            default:
                return res.status(500).json({
                    msg: 'Busqueda no valida'
                }); 
        }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
}


module.exports = {
    buscar
}