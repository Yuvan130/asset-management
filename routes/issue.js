const express = require('express');
const router = express.Router();
const { Asset, Employee, AssetHistory } = require('../models');

// Issue asset form
router.get('/', async (req, res) => {
  const assets = await Asset.findAll({ where: { status: 'available' } });
  const employees = await Employee.findAll({ where: { isActive: true } });
  res.render('issue/form', { assets, employees });
});

// Process asset issue
router.post('/', async (req, res) => {
  const { asset, employee } = req.body;
  try {
    const assetInfo = await Asset.findByPk(asset);
    if (assetInfo && assetInfo.status === 'available') {
      await assetInfo.update({ status: 'issued', currentUserId: employee });
      await AssetHistory.create({
        AssetId: asset,
        EmployeeId: employee,
        action: 'issued'
      });
      res.redirect('/assets');
    } else {
      res.status(400).send('Asset not available');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;