const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {

    return new Promise( (resolve, reject) => {

        const payload = {
            uid
        }

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {expiresIn: '12h'},
        (error, token) => {

            if(error) {
                reject(`No se pudo generar JWT: ${error}`);
            } else {
                resolve(token);
            }
        });

    }); 
}

module.exports = generarJWT