import {INTEGER, STRING} from 'sequelize';
import sequelize from './';

const Photo = sequelize.define('photo', {
  id: {type: INTEGER, primaryKey: true, autoIncrement: true},
  default: {type: STRING},
  small: {type: STRING},
  large: {type: STRING},
  thumb: {type: STRING},
});

Photo.save = (status, obj) => Photo.create({
  statusId: status.id,
  default: obj.default,
  small: obj.small,
  large: obj.large,
  thumb: obj.thumb,
});

Photo.prototype.toObj = function () {
  return {
    default: this.default,
    small: this.small,
    large: this.large,
    thumb: this.thumb,
  };
};

export default Photo;
