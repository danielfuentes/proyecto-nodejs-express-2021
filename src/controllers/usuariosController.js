const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const {
  check,
  validationResult,
  body
} = require('express-validator');

//Aquí requiero la Base  de Datos.
const db = require('../database/models/');

//Aquí hago la asociación al módelo correspondiente
const User = db.User;

//Este código lo comente ya que lo usavamos cuando trabajamos con los archivos en formato JSON
//let provincia = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../models/provincias.json')));

/*let provincias = provincia.sort(function (a, b) {
    if (a.nombre > b.nombre) {
      return 1;
    }
    if (a.nombre < b.nombre) {
      return -1;
    }
    // a debe ser igual a b
    return 0;
  });
*/


const usuariosController = {

    login: function(req,res){
        res.render(path.resolve(__dirname, '../views/usuarios/login'));
    },
    ingresar: (req, res) => {
		
      db.User.findAll()
      .then((users) => {		
        
        let errors = validationResult(req);
        
        let usuarioLogueado;
        
        /*-----Aquí programe un flter para verificar si el usuario está registrado o  no--------*/
        usuarioLogueado = users.filter(function (user) {
          return user.email == req.body.email && 
          bcrypt.compareSync(req.body.password, user.password)
        });
        
        
        if (usuarioLogueado == "" ) {
          res.render(path.resolve(__dirname, '../views/usuarios/login'),{ errors: [{ msg: "Credenciales invalidas" }] });
          
        } else {
          //Aquí guardo en SESSION al usuario logueado
          req.session.usuario = usuarioLogueado[0];
          
        }
        if(req.body.recordarme){
          res.cookie('email',usuarioLogueado[0].email,{maxAge: 1000 * 60 * 60 * 24})
        }
        return res.redirect('/');   //Aquí ustedes mandan al usuario para donde quieran (Perfil- home)

      })
    },

    registro: function(req,res){
      //Este código lo comente ya que así lo usamos pero cuando buscamos las provincias en un archivo en formato JSON. Pero ahora usamos una API externa
      //  res.render(path.resolve(__dirname, '../views/usuarios/registro'), {provincias});

      res.render(path.resolve(__dirname, '../views/usuarios/registro'));
    },
    //Este es el método donde guardo al usuario que se está registrando
    create: (req, res) => {
      let errors = validationResult(req);

      if(!errors.isEmpty()) {

        return res.render(path.resolve(__dirname, '../views/usuarios/registro'), {
          errors: errors.errors,  old: req.body
        });
      } 
      //Si todo marcha sobre ruedas, entonces 
      // Generamos el usuario a partir de los datos del request
      // - Ignoramos repassword
      // - Hasheamos la contraseña

      let user = {
        firstName:req.body.first_name,
        lastName: req.body.last_name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        provincia: Number(req.body.provincia),
        avatar: req.file ? req.file.filename : '',
        role: 1
      };

      User
      .create(user)
      .then((storedUser) => {
          return  res.redirect('/login');
      })
      .catch(error => console.log(error));
    },

    logout: (req,res) =>{
      req.session.destroy();
      res.cookie('email',null,{maxAge: -1});
      res.redirect('/')
    }

}
module.exports = usuariosController;
