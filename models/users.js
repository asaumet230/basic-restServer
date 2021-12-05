const { Schema, model } = require('mongoose');

const UsersSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria'],
        trim: true
    },
    img: {
        type: String // Ya que es un path    
    },
    role: {
        type: String,
        require: true,
        enum:['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'], //Este campo solo puede tomar estos valores
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


// Sacar de la respuesta a los campos __v y password:
UsersSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}


module.exports = model('Users', UsersSchema);