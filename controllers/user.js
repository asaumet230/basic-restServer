const { response, request } = require('express');

const usersGet =  (req = request, res= response)=> {

    const { name = 'No Name', apiKey, page = 1, limit= 5 } = req.query;

    res.json({
      msg: 'Get api - controlador',
      name,
      page,
      limit
    });        
}

const userPost = (req = request, res= response)=> {

    const {nombre, id} = req.body;

    res.status(200).json({
        msg: 'Post api - controlador',
        nombre,
        id
    });         
}

const userPut = (req = request, res= response)=> {

    const { id } = req.params;

    res.status(400).json({
        msg: 'Put api - controlador',
        id
    });         
}

const userDelete = (req = request, res= response)=> {
    res.status(400).json({
        msg: 'Delete api - controlador'
    });         
}

module.exports = {
    usersGet,
    userPost,
    userPut,
    userDelete
}