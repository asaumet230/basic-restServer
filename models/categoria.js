const { model, Schema } = require('mongoose');


const CategoriaSchema = Schema({

    nombre: {
        type: String,
        unique: true,
        require: [true, 'El nombre es obligatorío'],
        uppercase: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    }
});

//Retirar de la respuesta el campo __v:
CategoriaSchema.methods.toJSON = function() {

    const {__v, _id, estado, ...categoria } = this.toObject();
    categoria.cid = _id;
    return categoria; 
}

module.exports = model('Categoria', CategoriaSchema);