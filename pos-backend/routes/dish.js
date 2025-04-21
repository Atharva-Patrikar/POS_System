const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Category = require('../models/Category');

// Fetch all dishes
router.get('/dishes', async (req, res) => {
  try {
    const dishes = await Dish.findAll({ include: Category });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error });
  }
});

// Add a new dish
router.post('/dishes', async (req, res) => {
  try {
    const { name, price, type, category_id } = req.body;

    // Ensure all required fields are provided
    if (!name || !price || !type || !category_id) {
      return res.status(400).json({ message: "All fields (name, price, type, category_id) are required!" });
    }

    // Validate type field
    if (!['Veg', 'Non-Veg', 'Egg'].includes(type)) {
      return res.status(400).json({ message: "Type must be 'Veg', 'Non-Veg', or 'Egg'." });
    }

    // Check if the category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const dish = await Dish.create({ name, price, type, category_id });
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Error adding dish', error });
  }
});

// Fetch dishes by category
router.get('/dishes/category/:category_id', async (req, res) => {
  try {
    const { category_id } = req.params;
    const dishes = await Dish.findAll({ where: { category_id } });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes for category', error });
  }
});

module.exports = router;
