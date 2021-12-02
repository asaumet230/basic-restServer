const { response, request } = require('express');

const bcrypt = require('bcrypt');

//Modelos:
const Users = require('../models/users');


const usersGet =  async (req = request, res= response)=> {

    let { limite = 5, desde = 0 } = req.query;

    try {

        const [ usuarios, total ] = await Promise.all([
            Users.
                find({ estado: true }, 'nombre email role google img estado')
                .skip( Number(desde) )
                .limit( Number(limite) ),

            Users.countDocuments({ estado: true })
        ]);

        return res.status(200).json({
            msg: 'Get todos los usuarios',
            usuarios,
            total
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }
}


const usersPost = async (req = request, res= response)=> {
    
    const { password } = req.body;

    try {

        usuario = new Users(req.body);

        // Hasehamos la contraseña:
        const salt = await bcrypt.genSaltSync();
        usuario.password = await bcrypt.hashSync(password, salt);

        await usuario.save();

        return res.status(200).json({
            msg: 'Usuario creado exitosamente',
            usuario
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        })
    }

    
}

const usersPut = async (req = request, res= response)=> {

    const { id } = req.params;
    const { _id, password, google, email, ...body } = req.body;

    try {

        //Si viene password significa que lo quiere actualizar:
        if(password) {
            const salt = await bcrypt.genSaltSync();
            body.password = await bcrypt.hashSync(password, salt); //Aquí creas esta propiedad nuevamente en el objeto
        }

        const usuarioActualizado = await Users.findByIdAndUpdate({ _id: id }, body, { new: true });

        return res.status(200).json({
            msg: 'Usuario actualizado correctamente',
            usuarioActualizado
        });         
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }
}

const usersDelete = async (req = request, res= response) => {

    const { id } = req.params;

    try {

        // const usuario = await Users.findByIdAndDelete({ _id: id });
        /*** 
         * En las nuevas practicas no se deberia borrar los usuarios
         * fisicamente de la base de datos, lo unico es cambiar el estado a falso
         * esto porque se pierde la integridad referencial de lo que ha hecho el usuario
         * en la APP es decir los cambios que ha hecho en la base de datos.
        ***/

        const usuario = await Users.findByIdAndUpdate(id, { estado: false }, { new: true });

        return res.status(200).json({
            msg: 'Usuario eliminado exitosamente',
            usuario
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Error comuniquese con el administrador'
        });
    }

            
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}