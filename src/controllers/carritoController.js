const path = require('path');
const {validationResult} = require('express-validator');
//Estaes otra forma de requerir los modelos creados
const {Cart, Dish, Item, User} = require('../database/models');

module.exports = {
    addCart: (req,res) =>{
        const errores = validationResult(req);
        if(errores.isEmpty()){
            //Debemos buscar el producto por el id
            Dish.findByPk(req.body.productId,{
                include: ['category']
            })
            .then((productos) =>{
                //return res.send( typeof productos.discount)
                let price = productos.discount >0 ?
                Number(productos.price) * ((100 - productos.discount)/100) : Number(productos.price)

                //console.log(price +"==================================")
                //Crear mi items
                return Item.create({
                    salePrice : price,
                    quantity : req.body.cantidad,
                    subtotal : req.body.cantidad * price,
                    state: 1,
                    userId: req.session.usuario.id,
                    productId: productos.id,
                    cartId: null
                     
                }) 
                .then(item  => res.redirect('/productos'))
                .catch(error => console.log(error)) 
            })
        }else{
            Dish.findByPk(req.body.productId,{
                include: ['category']
            })
            .then(platoComida =>{
                res.render(path.resolve(__dirname, '..','views','productos','detail'), {platoComida  , errores: errores.mapped()});
            })
        }
    },
    cart : (req,res) =>{
        Item.findAll({
            where : {
                state: 1,
                userId : req.session.usuario.id
            },
            include: {
                all: true,
                nested: true
            }
        })        
        .then((items)=>{
            let total = items.reduce((total,item)=> (total = total + Number(item.subtotal)),0)

            res.render(path.resolve(__dirname, '..','views','carrito','carrito'), {cartProducto :items , total  } );
        })

    },
    deleteCart: (req,res) =>{
        Item.destroy({
            where: {
                productId : req.body.itemId,
                userId : req.session.usuario.id
            }
        })
        .then(()=> res.redirect('/carrito'))
        .catch(error => console.log(error))
    },
    shop : (req,res)=>{
        let totalPrecio = 0;
        Item.findAll({
            where:{
                userId: req.session.usuario.id,
                state: 1
            }
        })
        .then((items)=>{
            totalPrecio = items.reduce((total,item)=> (total = total + Number(item.subtotal)),0)
        })
        Cart.findOne({
            order: [['createdAt','DESC']]
        })
        .then((cart)=>{
            return Cart.create({
                orderNumber: cart ? cart.orderNumber + 1 : 1,
                total: totalPrecio,
                userId: req.session.usuario.id
            })
        })
        .then(cart =>{
            Item.update({
                state: 0,
                cartId: cart.id
            },{
                where: {
                    userId: req.session.usuario.id,
                    state: 1
                }
            }
            )
        })
        .then(()=> res.redirect('/carrito/historialCompra'))
        .catch(error => console.log(error))
    },
    history : (req,res) =>{
        Cart.findAll({
            where: {
                userId : req.session.usuario.id
            },
            include: {
                all: true,
                nested: true
            }
        })
        .then(carts =>{
            res.render(path.resolve(__dirname, '..','views','carrito','historialCompra'), {carts } );           
        })
    },
    buyDetail : (req,res) =>{
        Cart.findByPk(req.params.id, {
            include : {
                all: true,
                nested: true
            }
        })
        .then((cart) =>{
            res.render(path.resolve(__dirname, '..','views','carrito','detalleCompra'), {cart } );
        })
    }


}