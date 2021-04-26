//**Middleware controlo el acceso del usuario usando Sequelize**/

const fs = require('fs');
const path = require('path');

//------- Sequelize ----------------//

const { User} = require('../database/models');

//------- JSON ---------------------//
//let archivoUsuarios =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../models/usuarios.json')));
  


module.exports = (req,res,next) =>{
    //Variable locals (super global - vive en las vistas )
    res.locals.usuario = false;
    
    if(req.session.usuario){
        console.log('Daniel '+ req.session.usuario.email);
        res.locals.usuario = req.session.usuario;
        return next();
    }else if(req.cookies.email){
        User.findOne({
            where: {
               email: req.cookies.email
            }
        })
        .then(user =>{
            req.session.usuario = user;
            res.locals.usuario = user;
            
            return next();
    
        })


        //---- Esto lo coloque en comentarios ya que no estoy buscando al usuario en JSON, estoy buscando en la base de datos
        //let usuario = archivoUsuarios.find(usuario => usuario.email == req.cookies.email)

        //return res.send(usuario);
        //delete usuario.password;

        //req.session.usuario = usuario;
        //res.locals.usuario = usuario;
        //return next();
        //-----------------------------------------------------

                
    }else{
        return next();
    }
}

