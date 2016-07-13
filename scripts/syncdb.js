import sequelize from '../models/';

require('../models/user');
require('../models/status');
require('../models/photo');

sequelize.sync().then(() => process.exit());
