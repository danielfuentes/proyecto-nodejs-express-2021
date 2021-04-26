const path = require('path');
const fs = require('fs');
//const db =  require('../database/models/');
const {Dish, Category} = require('../database/models/');

//const Dish = db.sequelize;
//const Category = db.sequelize;

//let platos =  JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','models','platos.json')));
//let categorias =  JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','models','categorias.json')));


module.exports = {
    index: function(req,res){
        const platos = Dish.findAll();
        const categorias = Category.findAll();
        Promise.all([platos,categorias])
        .then(([platos,categorias]) =>{
            //return res.send(platos)
            res.render(path.resolve(__dirname , '..','views','productos','productos') , {platos,categorias});
        })           
        .catch(error => res.send(error))
    },

    categorias: (req,res) =>{
       //return res.send(req.query.categoria);
       const categorias = Category.findAll();
       const platos = Dish
       .findAll({
           where: {categoryId : req.query.categoria},
           include: [{association: 'category'}]
       })
       Promise.all([platos,categorias])
       .then(([platos,categorias]) =>
           //return res.send(platoComida);
           res.render(path.resolve(__dirname, '..','views','productos','productos'), {platos,categorias })
       )        
    },

    show: (req,res) => {
        Dish
        .findByPk(req.params.id, {
            include: ['category']
        })
        .then(platoComida =>{
            //return res.send(platoComida);
            res.render(path.resolve(__dirname, '..','views','productos','detail'), {platoComida });
        })
    },

}