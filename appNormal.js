const express = require('express');
const { response } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT

app.get('/', (req, res = response) => {
    res.send('hola mudo');
});


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});
