module.exports = (sequelize, dataTypes) => {
  let alias = 'User';
  let cols = {
      id: {
          type: dataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      firstName: dataTypes.STRING,
      lastName: dataTypes.STRING,
      email: dataTypes.STRING,
      password: dataTypes.STRING,
      provincia: dataTypes.INTEGER,
      avatar: dataTypes.STRING,
      role: dataTypes.INTEGER
  };
  /*let config = {
      tableName: 'users',
      timestamps: false
  };*/
      
  
  const User = sequelize.define(alias, cols)
  //Aquí hago la asociación con el carrito
  User.associate = function (models){
    User.hasMany(models.Item, {
      foreignKey: "userId",
      as: "items",
    });

    // associate with carts
    User.hasMany(models.Cart, {
      foreignKey: "userId",
      as: "carts",
    });
  }  

  return User;
}