import {INTEGER} from 'sequelize';
import sequelize from './';

const Log = sequelize.define('log', {
  id: {type: INTEGER, autoIncrement: true, primaryKey: true},
  from: {type: INTEGER, allowNull: true, defaultValue: null},
  to: {type: INTEGER, allowNull: true, defaultValue: null},
  resultFrom: {type: INTEGER, allowNull: true, defaultValue: null},
  resultTo: {type: INTEGER, allowNull: true, defaultValue: null}
}, {
  classMethods: {
    latest() {
      return this.findOne({
        order: [['createdAt', 'DESC']]
      });
    }
  }
});

export default Log;
