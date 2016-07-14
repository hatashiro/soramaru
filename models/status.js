import {INTEGER, BIGINT, STRING} from 'sequelize';
import sequelize from './';
import Photo from './photo';

const Status = sequelize.define('status', {
  /* management */
  id: {type: INTEGER, primaryKey: true, autoIncrement: true},
  list: {type: STRING},

  /* status */
  idStr: {type: STRING},
  text: {type: STRING},
  url: {type: STRING},

  /* user */
  uploaderId: {type: BIGINT},
  uploaderName: {type: STRING},
  uploaderScreenName: {type: STRING},
  uploaderProfileImage: {type: STRING},
}, {
  indexes: [
    { fields: ['userId', 'list'] },
    { fields: ['userId', 'list', 'idStr'], unique: true },
  ]
});

Status.hasMany(Photo, {as: 'photos'});

Status.prototype.toObj = function () {
  return {
    idStr: this.idStr,
    text: this.text,
    url: this.url,
    user: {
      id: this.uploaderId,
      name: this.uploaderName,
      screenName: this.uploaderScreenName,
      profileImage: this.uploaderProfileImage,
    },
    photos: this.get('photos').map(photo => photo.toObj()),
  };
};

export default Status;
