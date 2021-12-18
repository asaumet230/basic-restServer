const path = require('path');
const fs = require('fs');

const eliminarArchivos = async ( coleccion, nombre ) => {

    const pathImagen = path.join( __dirname, '../uploads/', coleccion, nombre );

    if( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = {
    eliminarArchivos
}