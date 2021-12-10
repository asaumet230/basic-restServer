const { request, response } = require('express');

//Models:
const { Categoria } = require('../models/index');

const obtenerCategorias = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0  } = req.query;

    try {

        const [ categoriasDB, total ] = await Promise.all([

            Categoria.find({ estado: true })
                .populate('usuario', 'nombre img email')
                .limit( Number(limite) )
                .skip( Number(desde) ),
            
            Categoria.countDocuments({ estado: true })
        ]); 

        return res.status(200).json({
            msg: 'Consulta exitosa',
            categoriasDB,
            total
        });


    } catch (error) {

        console.log(error);
        return res.status(400).json({
            msg: 'Error comuniquese con el administrador'
        });
    }

}

const obtenerCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;

    try {

        const categoriaDB = await Categoria.findById({ _id:id }).populate('usuario', 'nombre email img');

        if( !categoriaDB.estado ) {

            return res.status(400).json({
            msg:'La categoría no existe',
        });

        }

        return res.status(200).json({
            msg:'Consulta realizada con exíto',
            categoriaDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(400).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
}

const crearCategoria = async ( req = request, res = response ) => {

    const { nombre } = req.body;
    const usuarioAutenticado = req.usuarioAutenticado;

    try {

        let categoriaDB = await Categoria.findOne({ nombre });

        if( categoriaDB ) {
            return res.status(400).json({
                msg:`Ya existe categoría con ese nombre: ${ nombre }`
            });
        }

        categoriaDB = new Categoria({
            nombre,
            usuario: usuarioAutenticado._id
        });

        await categoriaDB.save();

        //El estado 201, siginifica que algo fue creado con exito:
        return res.status(201).json({
            msg: 'Categoría creada correctamente',
            categoriaDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
}

const actualizarCategoria = async(req = request, res = response ) => {

    const { id } = req.params;
    const { nombre } = req.body;
    const usuario = req.usuarioAutenticado._id;

    try {

        const existeCategoria = await Categoria.findOne({ nombre });

        if( existeCategoria ) {

            return res.status(400).json({
                msg: `Ya existe categoría con ese nombre: ${ nombre }`
            });
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate({ _id:id }, { nombre, usuario }, { new: true }).populate('usuario', 'nombre email img');

        return res.status(200).json({
            msg: 'Categoría actualizada correctamente',
            categoriaActualizada
        })
        
    } catch (error) {

        console.log(error);
        return res.status(400).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
}


const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    try {
        
        let categoriaDB = await Categoria.findById({ _id: id });

        if( !categoriaDB.estado ) {

            return res.status(400).json({
                msg: 'La categoría no existe'
            });
        }

       categoriaDB = await Categoria.findByIdAndUpdate({ _id: id }, { estado: false }, { new: true });

       return res.status(200).json({
           msg:`Categoría elminada exitosamente ${ categoriaDB.nombre }` 
       });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg:'Comuniquese con el administrador'
        });
    }

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}