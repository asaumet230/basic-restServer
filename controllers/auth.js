const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Models:
const Users = require('../models/users');

//Helpers:
const generarJWT = require('../helpers/generar-jwt');


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

module.exports = {
    login
}