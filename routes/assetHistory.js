const express = require('express');
const router = express.Router();
const { AssetHistory, Asset, Employee } = require('../models');

// Get asset history
router.get('/:assetId', async (req, res) => {
  try {
    const history = await AssetHistory.findAll({
      where: { asset_id: req.params.assetId },
      include: [Asset, Employee],
      order: [['date', 'DESC']]
    });
    res.render('asset-history/index', { history });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;