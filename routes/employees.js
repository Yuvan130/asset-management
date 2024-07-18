const express = require('express');
const router = express.Router();
const { Employee } = require('../models');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.render('employees/index', { employees });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a specific employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const employee = await Employee.findByPk(req.params.id);
    res.json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Create a new employee
router.post('/', async (req, res) => {
  try {
    const { name, email, isActive } = req.body;
    await Employee.create({ name, email, isActive: isActive === 'on' });
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, isActive } = req.body;
    await Employee.update(
      { name, email, isActive: isActive === 'on' },
      { where: { id: req.params.id } }
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.destroy({ where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
