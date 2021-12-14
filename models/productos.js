const { model, Schema } = require('mongoose');


const ProductoSchema = Schema({

    nombre: {
        type: String,
        require: [ true, 'El nombre es obligatorio' ],
        lowercase: true
    },
    referencia: {
        type: String,
        unique: true,
        lowercase: true,
        require: [ true, 'La referencia es obligatoria']
    },
    precio: {
        type: Number,
        default: 0
    },
    cantidad: {
        type: Number,
        default: 0
    },
    marca: {
        type: String,
        lowercase: true
    },
    descripcion: {
        type: String,
        lowercase: true
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    }
});

//Retirar y anexar los campos deseados:
ProductoSchema.methods.toJSON = function () {

    const { __v, _id, usuario, ...producto } = this.toObject();

    producto.pid = _id;
    const { nombre, email } = usuario;
    producto.usuario = { nombre, email };

    return producto;
}

module.exports = model('Producto', ProductoSchema);