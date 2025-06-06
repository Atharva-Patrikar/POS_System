const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import models
const Category = require('./Category');
const Dish = require('./Dish');
const TableModel = require('./table');

// Initialize models
const Table = TableModel(sequelize, Sequelize.DataTypes);

// Define associations
Category.hasMany(Dish, { foreignKey: 'category_id' });
Dish.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  Category,
  Dish,
  Table,
};