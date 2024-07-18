const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://asset_admin:Yuv@n 13@localhost:5432/asset_pg', {
  logging: console.log,  // Log all Sequelize queries for debugging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' } // Ensure correct field mapping
}, {
  tableName: 'employees', // Specify exact table name
  timestamps: true, // Enable timestamps if necessary
  createdAt: 'created_at', // Specify created_at column if it exists
  updatedAt: 'updated_at' // Specify updated_at column if it exists
});

const Asset = sequelize.define('Asset', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  serialNumber: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'serial_number' },
  make: DataTypes.STRING,
  model: DataTypes.STRING,
  purchaseDate: { type: DataTypes.DATE, field: 'purchase_date' },
  value: DataTypes.DECIMAL(10, 2),
  status: { type: DataTypes.ENUM('available', 'issued', 'scrapped'), defaultValue: 'available' },
  assetCategoryId: { type: DataTypes.INTEGER, field: 'asset_category_id', references: { model: 'asset_categories', key: 'id' } },
  currentUserId: { type: DataTypes.INTEGER, field: 'current_user_id', references: { model: 'employees', key: 'id' } }
}, {
  tableName: 'assets', // Specify exact table name
  timestamps: true, // Enable timestamps if necessary
  createdAt: 'created_at', // Specify created_at column if it exists
  updatedAt: 'updated_at' // Specify updated_at column if it exists
});

const AssetCategory = sequelize.define('AssetCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'asset_categories', // Specify exact table name
  timestamps: true, // Enable timestamps if necessary
  createdAt: 'created_at', // Specify created_at column if it exists
  updatedAt: 'updated_at' // Specify updated_at column if it exists
});

const AssetHistory = sequelize.define('AssetHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assetId: { type: DataTypes.INTEGER, field: 'asset_id', references: { model: 'assets', key: 'id' } },
  employeeId: { type: DataTypes.INTEGER, field: 'employee_id', references: { model: 'employees', key: 'id' } },
  action: { type: DataTypes.ENUM('purchased', 'issued', 'returned', 'scrapped'), allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  reason: DataTypes.TEXT
}, {
  tableName: 'asset_history', // Specify exact table name
  timestamps: true, // Enable timestamps if necessary
  createdAt: 'created_at', // Specify created_at column if it exists
  updatedAt: 'updated_at' // Specify updated_at column if it exists
});

// Define Associations
Asset.belongsTo(AssetCategory, { foreignKey: 'asset_category_id' });
Asset.belongsTo(Employee, { as: 'currentUser', foreignKey: 'current_user_id', constraints: false });
AssetHistory.belongsTo(Asset, { foreignKey: 'asset_id' });
AssetHistory.belongsTo(Employee, { foreignKey: 'employee_id' });
// Asset.belongsTo(AssetCategory, { foreignKey: 'asset_category_id' });
AssetCategory.hasMany(Asset, { foreignKey: 'asset_category_id' });


module.exports = { sequelize, Employee, Asset, AssetCategory, AssetHistory };
