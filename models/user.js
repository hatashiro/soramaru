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

User.prototype.saveStatus = async function (list, obj) {
  const status = await Status.create({
    userId: this.id,
    list: list,
    idStr: obj.idStr,
    text: obj.text,
    url: obj.url,
    uploaderId: obj.user.id,
    uploaderName: obj.user.name,
    uploaderScreenName: obj.user.screenName,
    uploaderProfileImage: obj.user.profileImage
  });

  return Promise.all(obj.photos.map(photo => Photo.save(status, photo)));
};

User.prototype.listStatuses = function (list, to) {
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

User.prototype.hasArchived = async function (list, idStr) {
  const status = await Status.findOne({
    where: { userId: this.id, list, idStr }
  });
  return !!status;
};

export default User;
