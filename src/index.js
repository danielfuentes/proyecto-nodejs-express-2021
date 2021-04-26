const express = require('express');
const methodOverride = require('method-override');
const app = express();
//Aqui requiero los paquetes para trabajar lo referido a session y cookies
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Requerir el middleware que controla si el usuario está o no Logueado
const acceso = require('./middlewares/acceso');

//Aqui requiero el middleare que controla la cantidad de elementos existentes en el carrito de compras por usuario

const carritoCantidadMiddleware = require('./middlewares/carritoCantidad');

//Aquí debo requerir mi Middleware de Mantenimiento
//const mantenimiento = require('./middlewares/mantenimiento');


//Debemos decirle a node - Donde estan nuestros archivos estáticos
app.use(express.static('public'));

//Setear cual va a corresponder Template Engine  - EJS 
app.set('view engine','ejs');

//Considerar que al enviar los datos desde el formulario los mismos lleguen al Servidor
app.use(express.urlencoded({extended: false}));
//Middleware para determinar metodos HTTP distintos a los aceptados por los formularios (GET - POST)
app.use(methodOverride('_method'));

// Aquí requerimos nuestros middlewares de session y cookies
app.use(session({
    secret : 'topSecret',
    resave: true,
    saveUninitialized: true,
}))

//Aqui coloco el Middleware para activar lo referido a las cookies
app.use(cookieParser());
//Aquí requiero el Middleware que controla si el usuario está o no Logueado
app.use(acceso);


//Aquí llamo a mi middleware para saber la cantidad de elementos que tiene el carrito
app.use(carritoCantidadMiddleware);

//Aquí debería colocar mi Middleware
//app.use(mantenimiento);

//Rutas  - Requerir archivo donde esta la ruta
const webRoutes = require('./routes/webRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const productoRoutes = require('./routes/productosRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiProductosRoutes = require('./routes/apis/apiProductosRoutes');
//Aquí incorporo la ruta del carrito
const carritoRoutes = require('./routes/carritoRoutes');

//Usar ese archivo de rutas - Middlewares

app.use(webRoutes);
app.use(usuariosRoutes);
app.use(productoRoutes);
app.use(adminRoutes);
app.use(apiProductosRoutes);
app.use(carritoRoutes);

//Levantar nuestro servidor
app.listen(3001,()=>console.log('Servidor corriendo en el puerto 3001'));