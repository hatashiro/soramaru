import sequelize from '../models/';

require('../models/log');

sequelize.sync().then(() => process.exit());
