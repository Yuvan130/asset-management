const express = require('express');
const router = express.Router();
const { AssetCategory } = require('../models');

// Get all asset categories
router.get('/', async (req, res) => {
  try {
    const categories = await AssetCategory.findAll();
    res.render('asset-categories/index', { categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/:id', async (req, res) => {
  try {
    const categories = await AssetCategory.findByPk(req.params.id);
    res.json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/asset-categories', async (req, res) => {
  try {
    const assetCategories = await AssetCategory.findAll();
    res.json(assetCategories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add new asset category
router.post('/', async (req, res) => {
  try {
    const category = await AssetCategory.create(req.body);
    res.redirect('/asset-categories');
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await AssetCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await category.update({ name });
    res.json(category);
  } catch (error) {
    console.error('Error updating asset category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// DELETE delete an asset category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await AssetCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await category.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting asset category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;