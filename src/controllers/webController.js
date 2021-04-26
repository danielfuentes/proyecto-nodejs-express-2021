const path = require('path');
const fs = require('fs');

//let platos  = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../models/platos.json')));
const {Dish, Category} = require('../database/models/');

const webController = {
    index: function(req,res){
        Dish
        .findAll()
        .then(platos =>{
            //return res.send(platos)
            res.render(path.resolve(__dirname, '..','views','web','index'), {platos: platos});
        })           
        .catch(error => res.send(error))
    },
    nosotros: function(req,res){
        //res.sendFile(path.resolve(__dirname, '../views/web/nosotros.html'));
        res.render(path.resolve(__dirname, '../views/web/nosotros'));
    }

}
module.exports = webController;