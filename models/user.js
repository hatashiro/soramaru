import {INTEGER, STRING} from 'sequelize';
import sequelize from './';

const User = sequelize.define('user', {
  id: {type: INTEGER, primaryKey: true},
  username: {type: STRING},
  thumbnail: {type: STRING},
  token: {type: STRING},
  tokenSecret: {type: STRING},
});

export default User;
