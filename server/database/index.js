const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('api_crawler', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const initDatabase = async () => {
  try {
    // First try to connect without database to create it
    const tempSequelize = new Sequelize('mysql', 'root', '123456', {
      host: 'localhost',
      dialect: 'mysql',
      logging: false
    });

    await tempSequelize.query('CREATE DATABASE IF NOT EXISTS api_crawler');
    await tempSequelize.close();

    // Now connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  initDatabase
};
