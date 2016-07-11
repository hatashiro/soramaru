import sequelize from '../models/';

require('../models/user');

sequelize.sync().then(() => process.exit());
