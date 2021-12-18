const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

//dataBase Connection:
const { dbConnection }= require('../dataBase/config');


class Server {

    constructor() {

        //Start the server with express:
        this.app = express();

        //Config the local port:
        this.port = process.env.PORT

        //End Points or Paths:
        this.paths = {
            users:      '/api/users',
            auth:       '/api/auth',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }
        

        //Connect Data Base:
        this.conectarDB();

        //Middlewares:
        this.middlewares();

        //Rutas de mi aplicación
        this.routes()
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){

        //Habilitación del cors:
        this.app.use(cors());

        //Pareo y lectura del Body:
        this.app.use(express.json());

        //Directorio publico donde se guardan los archivos:
        this.app.use(express.static('public'));

        //File Uploads - carga de archivo:
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // Esta opción permite que la carpeta donde se guardan las imagenes se cree sin haberla creado nosotros.
        }));
    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users') );
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        });
    }
}


module.exports = Server;