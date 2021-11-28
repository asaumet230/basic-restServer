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
        enum:['ADMIN_ROLE', 'USER_ROLE']
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


module.exports = model('Users', UsersSchema);