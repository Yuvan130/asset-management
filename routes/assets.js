const express = require('express');
const router = express.Router();
const { Asset, AssetCategory } = require('../models'); // Adjust model paths as per your project structure

// GET all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.findAll({ include: AssetCategory });
    res.render('assets/index', { assets, assetCategories: assets.map(asset => asset.AssetCategory) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single asset by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findByPk(id, { include: AssetCategory });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create a new asset
router.post('/', async (req, res) => {
  const { serialNumber, make, model, category, value } = req.body;
  try {
    const newAsset = await Asset.create({
      serialNumber,
      make,
      model,
      asset_category_id: category,
      value,
    });
    res.status(201).json(newAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update an existing asset
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { serialNumber, make, model, category, value } = req.body;
  try {
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    asset.serialNumber = serialNumber;
    asset.make = make;
    asset.model = model;
    asset.asset_category_id = category;
    asset.value = value;
    await asset.save();
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE delete an asset
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    await asset.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
