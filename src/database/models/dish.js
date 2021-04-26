module.exports = (sequelize, dataTypes) => {
    let alias = 'Dish';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: dataTypes.STRING,
        description: dataTypes.STRING,
        price: dataTypes.DECIMAL,
        discount: dataTypes.INTEGER,
        recommended: dataTypes.INTEGER,
        image: dataTypes.STRING
    };
    /*let config = {
        tableName: 'Papachos',
        timestamps: false
    };*/
        
    
    const Dish = sequelize.define(alias, cols)
    //Aquí creo mi relación entre Platos (Diskes) y Categorias (Categories)
    Dish.associate = function(models) {
        Dish.belongsTo(models.Category, {
                as : 'category',
                foreignKey: 'categoryId'
            
        });

        //Aquí hago la relación entre mi módelo Dish y mi tabla items  la cual contiene todo lo que el usuario está comprando
        Dish.hasMany(models.Item, {
            as: "items",
            foreignKey: "productId",
        });

        /*Dish.belongsTo(models.User, {
            as: "user",
            foreignKey: "userId",
        });*/

    };
    return Dish
}
