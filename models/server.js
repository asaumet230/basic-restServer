const express = require('express');
const cors = require('cors');


class Server {

    constructor(){

        //Start the server with express:
        this.app = express();

        //Config the local port:
        this.port = process.env.PORT

        //End Points or Paths:
        this.userPath = '/api/users';

        //Middlewares:
        this.middlewares();

        //Rutas de mi aplicación
        this.routes()
    }

    middlewares(){

        //Habilitación del cors:
        this.app.use(cors());

        //Pareo y lectura del Body:
        this.app.use(express.json());

        //Directorio publico donde se guardan los archivos:
        this.app.use(express.static('public'));
    }

    routes() {

        this.app.use(this.userPath, require('../routes/user') );

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        });
    }
}


module.exports = Server;