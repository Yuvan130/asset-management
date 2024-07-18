const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(function (req, res, next) {
  console.log("Middleware called");

  // Set the allowed origins (you can replace '*' with specific origins for security)
  res.header("Access-Control-Allow-Origin", "*");
  
  // Set the allowed methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Set the allowed headers
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      next();
  }
});
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/employees'));
app.use('/assets', require('./routes/assets'));
app.use('/asset-categories', require('./routes/assetCategories'));
app.use('/stock', require('./routes/stock'));
app.use('/issue', require('./routes/issue'));
app.use('/return', require('./routes/return'));
app.use('/scrap', require('./routes/scrap'));
app.use('/asset-history', require('./routes/assetHistory'));

// Sync database and start server
const PORT = process.env.PORT || 8080;
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database or sync schema:', error);
  });
module.exports = app;