const { request, response } = require('express');

//Models:
const Producto = require('../models');

const obtenerProductos = async ( req= request, res = response ) => {

    const { limite = 5, desde = 0  } = req.query;

    try {
    
        const [ productosDB, total ] = await Promise.all([
            Producto.find({ estado: true })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .limit( Number(limite) )
            .skip( Number(desde) ),

            Producto.countDocuments({ estado: true })
        ]);


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Comuniquese con el administrador'
        });
    }

}


module.exports = {
    obtenerProductos
}