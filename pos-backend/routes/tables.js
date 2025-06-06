const express = require('express');
const router = express.Router();
const { Table } = require('../models');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.findAll({ order: [['id', 'ASC']] });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// Create a new table
router.post('/', async (req, res) => {
  const { table_number, location, label } = req.body;
  try {
    const table = await Table.create({ table_number, location, label });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create table' });
  }
});

module.exports = router;
