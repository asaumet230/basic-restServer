const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Models:
const { Users } = require('../models/index');

//Helpers:
const generarJWT = require('../helpers/generar-jwt');
const googleVerify = require('../helpers/google-verify');


const login = async (req = request, res = response) => {

    const { email, password } = req.body; 

    try {

        const usuarioDB = await Users.findOne({email});

        if(!usuarioDB) {
            return res.status(400).json({
                msg: 'No existe usuario con ese email'
            });
        }

        if(!usuarioDB.estado) {
            return res.status(400).json({
                msg: 'No existe usuario con ese email'
            });
        }

        const validacionPassword = await bcrypt.compareSync(password, usuarioDB.password);

        if(!validacionPassword) {
            return res.status(400).json({
                msg: 'Email o password incorrectos',
          
            });
        }


        const token = await generarJWT(usuarioDB._id);

        return res.status(200).json({
            msg:'Login exitoso',
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }

}

const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { email, img, nombre } = await googleVerify(id_token);

        let usuario = await Users.findOne({ email });

        if( !usuario ) {

            usuario = new Users({
                nombre,
                email,
                img,
                password: '@@@@@@',
                google: true
            });

           
        } else {
            usuario.google = true;
        }

        // Guardamos el usuario:
        await usuario.save();


        // Si el usuario aunque sea de google ha sido eliminado no se puede permitir el registro nuevamente:
        if( !usuario.estado ) {

            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });

        }

        //Generamos el JWT:
        const token = await generarJWT(usuario._id);


        return res.status(200).json({
            msg: 'Login con google OK',
            email,
            nombre,
            img,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error comuniquese con el administrador'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}