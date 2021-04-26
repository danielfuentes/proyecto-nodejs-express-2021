const path = require('path');
const fs = require('fs');

//requerir su Base  de Datos.
const db = require('../../database/models/');
//Aqui hacen esto para lograr activa los operadores en sus querys (like - count - max) 
const Op = db.Sequelize.Op;


const Dish = db.Dish;

module.exports = {
    index : (req,res) =>{
        Dish
        .findAll()
        .then(platos =>{
            let respuesta = {
                meta: {
                    status: 200,
                    longitud : platos.length,
                    url: req.originalUrl
                },
                data: platos
            }     
            res.json(respuesta);

        })           
        .catch(error => res.send(error))
    },
    create: (req,res) =>{
        res.render(path.resolve(__dirname, '..','views','admin','create'));
    },
    save: (req,res) =>{
        const _body = req.body;
        //return res.send(_body);
        _body.name = req.body.nombre,
        _body.description = req.body.descripcion,
        _body.price =  req.body.precio,
        _body.discount = req.body.descuento,
        _body.image = req.file ? req.file.filename : ''    // if ternario       

        Dish
        .create(_body)
        .then(plato =>{
            res.redirect('/administrar');
        })  
        
    },
    show: (req,res) => {
        Dish
        .findByPk(req.params.id)
        .then(platoComida =>{
            res.render(path.resolve(__dirname, '..','views','admin','detail'), {platoComida });
        })
    },
    destroy: (req,res) => {
        Dish
        .destroy({
            where : {
               id:  req.params.id
            },
            force : true 
        })
        .then(confirm =>{
            res.redirect('/administrar');
        })
    },
    edit: (req,res) => {
        Dish
        .findByPk(req.params.id)
        .then(platoComida =>{
            res.render(path.resolve(__dirname, '..','views','admin','edit'), {platoComida });
        })

    },
    update: (req,res) =>{
        const _body = req.body;
        //return res.send(_body);
        _body.name = req.body.nombre,
        _body.description = req.body.descripcion,
        _body.price =  req.body.precio,
        _body.discount = req.body.descuento,
        _body.image = req.file ? req.file.filename : req.body.oldImagen    // if ternario       

        Dish
        .update(_body ,{
            where : {
                id : req.params.id
            }
        })
        .then(plato =>{
            res.redirect('/administrar')
        })
        .catch(error => res.send(error));     //error de Base de Datos
    },
    search: ( req, res) =>{
        Dish.findAll({
            where:{
                name: {[Op.like]: `%${req.query.buscar}%`}
            }
        })
        .then(resultado => { res.render(path.resolve(__dirname, '..', 'views', 'admin', 'index'),{platos: resultado});})
        .catch(error => res.send(error))
    }

}
