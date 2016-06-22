import Sequelize from 'sequelize';
import {isUndefined} from 'lodash';

const db = require('../config/db.json');

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
  logging: isUndefined(db.logging) ? console.log : db.logging
});

export default sequelize;
