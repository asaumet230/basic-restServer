const { response, request } = require('express');

const bcrypt = require('bcrypt');

//Modelos:
const Users = require('../models/users');

const usersGet =  (req = request, res= response)=> {

    const { name = 'No Name', apiKey, page = 1, limit= 5 } = req.query;

    res.json({
      msg: 'Get api - controlador',
      name,
      page,
      limit
    });        
}

const usersPost = async (req = request, res= response)=> {
    
    const { nombre, email, password, role } = req.body;

    try {

        let usuario = await Users.findOne({ email });

        if(usuario) {
            return res.status(401).json({
                msg:'Error ya existe usuario con ese Email'
            });
        }

        usuario = new Users(req.body);

        // Hasehamos la contraseña:
        const salt = await bcrypt.genSaltSync();
        usuario.password = await bcrypt.hashSync(password, salt);

        await usuario.save();

        return res.status(200).json({
            msg: 'Usuario creado exitosamente',
            nombre,
            email,
            role
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        })
    }

    
}

const usersPut = (req = request, res= response)=> {

    const { id } = req.params;

    res.status(400).json({
        msg: 'Put api - controlador',
        id
    });         
}

const usersDelete = (req = request, res= response)=> {
    res.status(400).json({
        msg: 'Delete api - controlador'
    });         
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}