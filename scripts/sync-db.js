import sequelize from '../models/';

require('../models/log');
require('../models/tweet');

sequelize.sync().then(() => process.exit());
