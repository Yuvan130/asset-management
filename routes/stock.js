const express = require('express');
const router = express.Router();
const { Asset, sequelize, AssetCategory } = require('../models');

// Get stock view
router.get('/', async (req, res) => {
  try {
    const stock = await Asset.findAll({
      attributes: [
        [sequelize.col('Asset.asset_category_id'), 'AssetCategory_id'], // Alias for asset_category_id
        [sequelize.fn('COUNT', sequelize.col('Asset.id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('value')), 'totalValue'],
        [sequelize.col('AssetCategory.name'), 'categoryName'] // Alias for AssetCategory.name
      ],
      include: [{
        model: AssetCategory,
        attributes: [], // Empty array means no additional attributes from AssetCategory
        required: false
      }],
      where: {
        status: 'available'
      },
      group: ['Asset.asset_category_id', 'AssetCategory.id', 'AssetCategory.name'],
      raw: true
    });

    res.render('stock/index', { stock });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;