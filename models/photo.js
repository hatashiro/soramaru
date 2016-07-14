import {INTEGER, STRING} from 'sequelize';
import appConfig from '../config/app';
import sequelize from './';
import download from '../lib/download';
import path from 'path';

const Photo = sequelize.define('photo', {
  id: {type: INTEGER, primaryKey: true, autoIncrement: true},
  default: {type: STRING},
  small: {type: STRING},
  large: {type: STRING},
  thumb: {type: STRING},
});

async function savePhoto(url, basename) {
  if (!url) {
    return null;
  }

  const ext = path.extname(url).split(':')[0];
  const archivePath = `${appConfig.archiveDir}/${basename}${ext}`;
  await download(url, archivePath);

  return archivePath;
}

Photo.save = async (status, obj) => {
  const photo = await Photo.create({ statusId: status.id });

  photo.set('default', await savePhoto(obj.default, `${status.id}-${photo.id}-default`));
  photo.set('small', await savePhoto(obj.small, `${status.id}-${photo.id}-small`));
  photo.set('large', await savePhoto(obj.large, `${status.id}-${photo.id}-large`));
  photo.set('thumb', await savePhoto(obj.thumb, `${status.id}-${photo.id}-thumb`));

  return photo.save();
};

Photo.prototype.toObj = function () {
  return {
    default: this.default,
    small: this.small,
    large: this.large,
    thumb: this.thumb,
  };
};

export default Photo;
