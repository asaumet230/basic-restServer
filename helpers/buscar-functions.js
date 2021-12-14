const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

//Models:
const { Users, Categoria, Producto } = require('../models/index');

const buscarUsuario = async ( termino = '', res= response) => {

    const esMongoId = ObjectId.isValid( termino ); // Si es devuelve un TRUE.
  
    if( esMongoId ) {

        const usuario = await Users.findById({ _id: termino, estado: true });
        return res.status(200).json({
            results: (usuario.estado)? [usuario] : []
        });

    } else {

        // Las busquedas por terminos son case sensitive:
        const regex = new RegExp(termino, 'i'); //Por esto se usa expresiones regulares

        // Esta es la forma de buscar en dos campos de la misma colección, con condición de un tercer campo:
        const usuario = await Users.find({
            $or:[ { nombre: regex }, { email: regex} ],
            $and:[ { estado: true }]
        });

        return res.status(200).json({
            results: (usuario)? [usuario] : []
        });
    }
}

const buscarCategoria = async( termino = '', res= response ) => {

    const isMongoId = await ObjectId.isValid(termino);

    if( isMongoId ) {

        const categoria = await Categoria.findById( {_id: termino, estado: true} ).populate('usuario', 'nombre email');

        return res.status(200).json({
            results: (categoria.estado)? [categoria] : []
        });

    } else {

        const regex = new RegExp(termino, 'i');

        const categoria = await Categoria.find({ nombre: regex, estado: true }); // Esta forma de buscar es como un AND.

        return res.status(200).json({
            results: (categoria)? [categoria] : []
        });
    }

}


const buscarProducto = async( termino = '', res= response ) => {

    const isMongoId = await ObjectId.isValid(termino);

    if( isMongoId ) {

        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre');

        return res.status(200).json({
            results: (producto.estado)? [producto] : []
        });

    } else {

        const regex = new RegExp(termino, 'i');

        const producto = await Producto.find({  

            $or:[   
                    { nombre: regex }, 
                    { referencia: regex },
                    { marca: regex },
                    { descripcion: regex },
                ],

            $and:[ { estado: true }]

        }).populate('usuario', 'nombre email').populate('categoria', 'nombre');; // Esta forma de buscar es como un AND.

        return res.status(200).json({
            results: (producto)? [producto] : []
        });
    }

}

module.exports = {
    buscarUsuario,
    buscarCategoria,
    buscarProducto
}