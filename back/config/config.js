require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'picture_trace',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00', 
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true
    },
    define: {
    timestamps: true
    }
  },
  test: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'picture_trace',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00', 
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true
    },
    define: {
    timestamps: true
    }
  },
  production: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'picture_trace',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00', 
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      typeCast: true
    },
    define: {
    timestamps: true
    },
    logging: false,
  }
}
