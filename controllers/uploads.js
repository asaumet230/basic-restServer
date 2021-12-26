const { request, response } = require("express");
const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2;

// Forma en que autenticas tu servicio REST con cloudinary.
cloudinary.config( process.env.CLOUDINARY_URL );


// Models: 
const { Users, Producto } = require('../models');

// Helpers:
const { subirArchivo, eliminarArchivos } = require('../helpers');



const cargarArchivo = async (req = request, res = response) => {


  try {

    // En el segundo argumento colocas las extensiones de los archivos que deseas que se suban ejemplo: ['.txt', '.md', '.pdf'], si no  colocas nada o undefined se establecen las de por defectos.
    const nombre = await subirArchivo( req.files, undefined, 'imgs' );
    return res.status(200).json({ nombre });
    
  } catch (error) {
    return res.status(400).json({
      msg: error
    });
  }
}


// Forma de actualizar o cargar imagen de manera local sin cloudinary, pero en Heroku, digital ocean etc... borran estos archivos:
const actualizarImagen = async ( req = request, res = response ) => {

  const { coleccion, id } = req.params;
  let nombre;


  try {

    switch (coleccion) {
      
      case 'users':
        
        let usuarioDB = await Users.findById(id);
        
        if( !usuarioDB || !usuarioDB.estado ) {
          return res.status(400).json({
            msg: `El usuario con Id; ${ id } no existe`
          });
        }

        // Eliminamos la imagen anterior:
        if( usuarioDB.img ) {
          await eliminarArchivos( coleccion, usuarioDB.img );
        }
        
        nombre = await subirArchivo(req.files, undefined, coleccion );
        usuarioDB = await Users.findByIdAndUpdate(id, { img: nombre }, { new: true });

        return res.status(200).json({
          msg: 'Imagen guardada correctamente',
          usaurio: usuarioDB
        });

      case 'productos':
        
        let productoDB = await Producto.findById(id);
    
        if( !productoDB || !productoDB.estado ) {
          return res.status(400).json({
            msg: `El producto con Id; ${ id } no existe`
          });
        }

        // Eliminamos la imagen anterior:
        if( productoDB.img ) {
          await eliminarArchivos( coleccion, productoDB.img );
        }
        
        nombre = await subirArchivo(req.files, undefined, coleccion);
        productoDB = await Producto.findByIdAndUpdate(id, { img: nombre }, { new: true }).populate('usuario', 'nombre email');

        return res.status(200).json({
          msg: 'Imagen guardada correctamente',
          producto: productoDB
        });

    
    
      default:
        return res.status(401).json({
          msg: 'Consulta no valida'
        });
    }
    
  } catch (error) {
    console.log(error);
    return res.json(500).json({
      msg: 'Error comuniquese con el administrador'
    });
  }

}

// Forma de actualizar o cargar imagen con cloudinary:
const actualizarImagenCloudinary = async ( req = request, res = response ) => {

  const { coleccion, id } = req.params;
  let modelo;


  try {

    switch (coleccion) {
      
      case 'users':
        
        modelo = await Users.findById(id);
        
        if( !modelo || !modelo.estado ) {
          return res.status(400).json({
            msg: `El usuario con Id; ${ id } no existe - users`
          });
        }

      break;
      
      case 'productos':
        
        modelo = await Producto.findById(id).populate('usuario', 'nombre email');
        
        if( !modelo || !modelo.estado ) {
          return res.status(400).json({
            msg: `El producto con Id; ${ id } no existe - productos`
          });
        }
        
      
      break;

      default:
        return res.status(401).json({
          msg: 'Consulta no valida'
        });
    }


     // Eliminamos la imagen anterior:
        if( modelo.img ) {
          
          const nombreArr = modelo.img.split('/');
          const nombre = nombreArr[ nombreArr.length - 1 ];
          const [ public_id ] = nombre.split('.');

          // Borramos la imagen en Cloudinary:
          cloudinary.uploader.destroy(public_id);

        }

        // Subimos la imagen a Cloudinary:
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    
        modelo.img = secure_url;
        await modelo.save();

        return res.status(200).json({
          msg: 'Imagen guardada correctamente',
          modelo
        });
    
        
  } catch (error) {
    console.log(error);
    return res.json(500).json({
      msg: 'Error comuniquese con el administrador'
    });
  }

}

const mostrarImagen = async ( req = request, res = response ) => {

  const { coleccion, id } = req.params;
  let modelo;

  try {

    switch (coleccion) {
      
      case 'users':

        modelo = await Users.findById(id);
        
        if( !modelo || !modelo.estado ) {
          return res.status(400).json({
            msg: `El usuario con Id; ${ id } no existe`
          });
        }

      break;

      case 'productos':

        modelo = await Producto.findById(id);
        
        if( !modelo || !modelo.estado ) {
          return res.status(400).json({
            msg: `El producto con Id; ${ id } no existe`
          });
        }
      break;

      default:
        return res.status(401).json({
          msg: 'Consulta no valida'
        });
    }

    if( modelo.img ) {

      const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
      if( fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }

    } else {

      const imagenDefecto = path.join(__dirname, '../assets/no-image.jpg');
      return res.sendFile(imagenDefecto);
    }
  
    
  } catch (error) {
    console.log(error);
    return res.json(500).json({
      msg: 'Error comuniquese con el administrador'
    });   
  }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}