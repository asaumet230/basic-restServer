const { response, request } = require('express');

const Users = require('../models/users');


const login = (req = request, res = response) => {

    const { email, password } = req.body; 

    try {

        return res.status(200).json({
            msg:'Desde Login',
            email,
            password
        })
        
    } catch (error) {
        console.lo(error);
    }


}

module.exports = {
    login
}