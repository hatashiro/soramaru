import {INTEGER, STRING} from 'sequelize';
import sequelize from './';
import Status from './status';
import Photo from './photo';

const User = sequelize.define('user', {
  id: {type: INTEGER, primaryKey: true},
  username: {type: STRING},
  thumbnail: {type: STRING},
  token: {type: STRING},
  tokenSecret: {type: STRING},
});

User.hasMany(Status, {as: 'statuses'});

User.prototype.saveStatus = async (list, obj) => {
  const status = await Status.create({
    userId: this.id,
    list: list,
    id: obj.id,
    text: obj.text,
    url: obj.url,
    uploaderId: obj.user.id,
    uploaderName: obj.user.name,
    uploaderScreenName: obj.user.screenName,
    uploaderProfileImage: obj.user.profileImage
  });

  return Promise.all(obj.photos.map(photo => Photo.save(status, photo)));
};

User.prototype.listStatuses = (list, to) => {
  const where = { userId: this.id, list: list };

  if (to) {
    where.id = { $lt: to };
  }

  return Status.findAll({
    where,
    include: [{ model: Photo }],
    order: 'id DESC',
    limit: 20,
  });
};

export default User;
