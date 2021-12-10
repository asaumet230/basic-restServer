const { model, Schema } = require('mongoose');


const ProductoSchema = Schema({

    nombre: {
        type: String,
        require: [ true, 'El nombre es obligatorio' ],
        lowercase: true
    },
    referencia: {
        type: String,
        lowercase: true,
        require: [ true, 'La referencia es obligatoria']
    },
    precio: {
        type: Number,
        require: [ true, 'El precio es obligatorio' ]
    },
    cantidad: {
        type: Number,
        require: [ true, 'La cantidad es obligatorio' ]
    },
    marca: {
        type: String,
        require: [ true, 'La marca es obligatorio' ],
        lowercase: true
    },
    descripcion: {
        type: String,
        require: [ true, 'La descipción es obligatorio' ],
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



module.exports = model('Producto', ProductoSchema);