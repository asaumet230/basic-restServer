const { Schema, model } = require('mongoose');


const RoleSchema = Schema({
    role : {
        type: String,
        require: [ true , 'El rol debe ser obligatorio']
    }
});


module.exports = model('Roles',RoleSchema);
