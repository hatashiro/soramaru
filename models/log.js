import {BIGINT} from 'sequelize';
import sequelize from './';

const Log = sequelize.define('log', {
  id: {type: BIGINT, autoIncrement: true, primaryKey: true},
  from: {type: BIGINT, allowNull: true, defaultValue: null},
  to: {type: BIGINT, allowNull: true, defaultValue: null},
  resultFrom: {type: BIGINT, allowNull: true, defaultValue: null},
  resultTo: {type: BIGINT, allowNull: true, defaultValue: null}
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
