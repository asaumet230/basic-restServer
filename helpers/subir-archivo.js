const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['.jpg', '.png', '.jpeg', '.gif'], carpeta = '' ) => {


    return new Promise( (resolve, reject) => {
        
       // Forma de leer el objeto archivo:
        const { archivo } = files;

        // Validar extensión del archivo:
        const extensionArchivo = archivo.name.substring( archivo.name.lastIndexOf('.'), archivo.length );
        
        // Validar extensiones validas:
        if(!extensionesValidas.includes(extensionArchivo)) {
            return reject(`La extensión ${ extensionArchivo } no es valida debe de ser alguna de estas: ${ extensionesValidas }`);
        }

        const nombreArchivo = `${ uuidv4() }${ extensionArchivo }`;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreArchivo);

        // Se usa la funció (mv) para mover al archivo a donde lo quieras guardar en tu servidor:
        archivo.mv(uploadPath, (error) => {
            
            if (error) {
                return reject(error);
            }

            resolve( nombreArchivo );
                
        });
    }) 
  

}

module.exports = {
    subirArchivo
}