const express = require('express');
const router = express.Router();
const { Asset, AssetHistory } = require('../models');

// Return asset form
router.get('/', async (req, res) => {
  const issuedAssets = await Asset.findAll({ where: { status: 'issued' } });
  res.render('return/form', { issuedAssets });
});

// Process asset return
router.post('/', async (req, res) => {
  const { asset, reason,notes } = req.body;
  try {
    console.log(req.body);
    const assetInfo = await Asset.findByPk(asset);
    if (assetInfo && assetInfo.status === 'issued') {
      await assetInfo.update({ status: 'available', currentUserId: null });
      await AssetHistory.create({
        AssetId: asset,
        EmployeeId: assetInfo.currentUserId,
        action: 'returned',
        reason:reason,
        note:notes
      });
      res.redirect('/assets');
    } else {
      res.status(400).send('Asset not issued');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;