const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Category = require('./Category');
const Dish = require('./Dish');

// Define associations here after importing both
Category.hasMany(Dish, { foreignKey: 'category_id' });
Dish.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  Category,
  Dish,
};
