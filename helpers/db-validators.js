const Users = require('../models/users');
const Roles = require('../models/roles');


const esRolValido = async (role = '') => {

    const existeRole = await Roles.findOne({role});

    if(!existeRole) {
        throw new Error(`El Role: ${role} no es válido`);
    }                       
}

const emailExiste =  async (email) => {
    
    const existeEmail = await Users.findOne({ email });

    if(existeEmail) {
        throw new Error(`El email: ${email} ya existe en la base de datos`); 
    }
}

const existeUsuarioPorID = async (id) => {

    const usuario = await Users.findById({ _id: id });

    if(!usuario) {
        throw new Error(`Usuario con id: ${ id } no existe`);   
    }
    
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID
}