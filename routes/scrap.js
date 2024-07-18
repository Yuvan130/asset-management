const express = require('express');
const router = express.Router();
const { Asset, AssetHistory } = require('../models');

// Scrap asset form
router.get('/', async (req, res) => {
  const assets = await Asset.findAll({ where: { status: ['available', 'issued'] } });
  res.render('scrap/form', { assets });
});

// Process asset scrap
router.post('/', async (req, res) => {
  const { asset, reason,notes } = req.body;
  try {
    console.log(req.body);
    const assetInfo = await Asset.findByPk(asset);
    if (assetInfo && assetInfo.status !== 'scrapped') {
      await assetInfo.update({ status: 'scrapped', currentUserId: null });
      await AssetHistory.create({
        AssetId: asset,
        action: 'scrapped',
        reason:reason,
        note:notes
      });
      res.redirect('/assets');
    } else {
      res.status(400).send('Asset already scrapped or not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;