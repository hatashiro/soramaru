import {BIGINT, INTEGER, STRING} from 'sequelize';
import sequelize from './';
import Photo from './photo';

const Status = sequelize.define('status', {
  /* management */
  list: {type: STRING},

  /* status */
  id: {type: BIGINT, primaryKey: true},
  text: {type: STRING},
  url: {type: STRING},

  /* user */
  uploaderId: {type: INTEGER},
  uploaderName: {type: STRING},
  uploaderScreenName: {type: STRING},
  uploaderProfileImage: {type: STRING},
});

Status.hasMany(Photo, {as: 'photos'});

Status.prototype.toObj = function () {
  return {
    id: this.id,
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
