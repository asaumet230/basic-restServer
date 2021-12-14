const { Users, Roles, Categoria, Producto  } = require('../models/index');


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

const existeCategoriaID = async (id) => {

    const categoria = await Categoria.findById({ _id: id });

    if( !categoria || !categoria.estado ) {
        throw new Error(`Categoría con id: ${ id } no existe`);   
    }
    
}

const existeProductoID = async (id) => {

    const productoDB = await Producto.findById({ _id:id });

    if( !productoDB || !productoDB.estado ) {
        throw new Error(`El producto con id: ${ id } no existe`);
    }
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaID,
    existeProductoID
}