require('babel-core/register');

const sequelize = require('../models/').default;

require('../models/user');
require('../models/status');
require('../models/photo');

sequelize.sync().then(() => process.exit());
