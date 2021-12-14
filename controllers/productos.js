const { request, response } = require('express');

//Models:
const { Producto, Categoria } = require('../models/index');

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

        if( total === 0 ) {

            return res.status(401).json({
                msg:'No hay productos creados todavia'
            })
        }

        return res.status(200).json({
            msg:'Consulta exitosa',
            productosDB,
            total
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Comuniquese con el administrador'
        });
    }
}

const obtenerProducto = async( req= request, res = response ) => {

    const { id } = req.params

    try {

       const productoDB = await Producto.findById({ _id:id })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre');

        const categoriaDB = await Categoria.findById(productoDB.categoria);

        if( !categoriaDB.estado ) {

            return res.status(401).json({
                msg: `Categoria: ${ categoriaDB.nombre } no existe comuniquese con el administrador`
            });

        }

       return res.status(200).json({
           msg: 'Consulta exitosa',
           productoDB,
       });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }

}

const crearProducto = async ( req= request, res = response ) => {

    const { nombre, 
            referencia, 
            precio, 
            cantidad, 
            marca, 
            descripcion, 
            img, 
            categoria } = req.body;

    const data = {
        nombre, 
        referencia, 
        precio, 
        cantidad, 
        marca, 
        descripcion, 
        img, 
        categoria,
        usuario: req.usuarioAutenticado
    }

    try {

        let productoDB = await Producto.findOne({ referencia });

        if(productoDB) {
            return res.status(400).json({
                msg:`Error el producto con la referencia: ${ referencia } ya existe`
            });
        }

        productoDB = new Producto( data );
        await productoDB.save();

        return res.status(200).json({
            msg: 'Producto creado exitosamente',
            productoDB
        })


        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }
}

const actualizarProducto = async ( req= request, res = response ) => {

    const { id } = req.params;
    const { referencia, estado, ...producto } = req.body;

    producto.usuario = req.usuarioAutenticado;

    try {

        let productoDB = await Producto.findByIdAndUpdate({ _id: id }, producto, { new: true })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre');

        return res.status(200).json({
            msg: 'Actualización de producto exitosa',
            productoDB
        })

        
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }
}

const borrarProducto = async ( req= request, res = response ) => {

    const { id } = req.params;

    try {

        const productoDB = await Producto.findByIdAndUpdate({ _id: id }, { estado: false }, { new: true });

        const categoriaDB = await Categoria.findById(productoDB.categoria);

        if( !categoriaDB.estado ) {

            return res.status(401).json({
                msg: `Categoria: ${ categoriaDB.nombre } no existe comuniquese con el administrador`
            });

        }

        return res.status(200).json({
            msg: `Producto con id: ${ productoDB._id } y nombre: ${ productoDB.nombre } eliminado exitosamente`,
        });

        
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}