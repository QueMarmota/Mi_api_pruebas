const express = require('express');
var cors = require('cors');//NOS PERMITE TENER ACCESO A OTRO SERVIDOR DESDE OTRO PUERTO YA QUE ANTERIORMENTE SE TRABAJABA EN LOCAL CON EL MISMO PUERTO
const app = express();
const morgan = require('morgan');//morgan nos regresa el resultado y tiempo de las peticiones
const bodyParser = require('body-parser');//body parser se utiliza para cuando hacemos post con json para traer los datos con req.body
const mongoose = require('mongoose');

//rutas que nos llevan a nuestros recursos
const productsRoute = require('./api/routes/products');

//mongoose
//la cadena de conexion se obtiene de la paginad e mongo despues de haber creado un cluster con atlas y MONGO_ATLAS_PW es la contraseña que definimos para el usuario del cluster
//y esa pw se encuentra en nodemon.json para no tener que ponerla en la cadena de conexion(la contraseña no debe tener caracteres especiales).
// mongoose.connect("mongodb://renteria:" +
//     process.env.MONGO_ATLAS_PW +
//     "@app-web-shard-00-00-uw98x.mongodb.net:27017,app-web-shard-00-01-uw98x.mongodb.net:27017,app-web-shard-00-02-uw98x.mongodb.net:27017/test?ssl=true&replicaSet=App-web-shard-0&authSource=admin&retryWrites=true"
//     , { useNewUrlParser: true }
// );


mongoose.connect('mongodb://rafael:Qwert123@ds121282.mlab.com:21282/app-web-nutriologa', { useNewUrlParser: true })
.then(db => console.log('db connected'))
.catch(err => console.log(err));

mongoose.Promise = global.Promise;//para que no de error de deprecated por trabajar con promesas
//este midleware es para hacer la carpeta uploads publica para hacer que cualquiera pueda entrar a nuestros recursos
//el '/uploads antes es para que la direccion url entre por medio de esa ruta'
//direccion para entrar al recurso (imagen es este caso)http://localhost:3000/uploads/diagramabdsirahd.png
app.use('/uploads', express.static('uploads'));
app.use(express.json());//le decimos a nuestra aplicacion q RECIBA informacion por medio de formato json (MIDDLEWARE)
app.use(express.static('public'));//middleware para servir archivos estaticos osea archivos que no van a cambiar , parametro raiz public por convencion ese arcchivo se debe agregar en la carpeta de trabajo , es un directorio donde los usuarios van a poder consultar cosas

//morgan 
app.use(morgan('dev'));
//BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//CORS
//aqui le dedimos al servidor que cualquier cliente pueda hacer peticiones a el ,(CORS)
// app.use((req, res, next) => {
//     res.header('Acces-Control-Allow-Origin', '*');//el asterisco especifica cuales clientes pueden acceder a la API
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
//         return res.status(200).json({

//         });
//     }
//     next();
// })
app.use(cors());//middleware para inccorporar el acceso desde otros "lados"

//rutas que deben manejar una peticion
app.use('/products', productsRoute);


app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
module.exports = app;