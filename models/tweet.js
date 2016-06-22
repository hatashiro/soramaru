import {BIGINT, STRING} from 'sequelize';
import sequelize from './';

const Tweet = sequelize.define('tweet', {
  id: {type: BIGINT, primaryKey: true},
  json: {type: STRING(2048)}
}, {
  classMethods: {
    insert(tweet) {
      return this.create({id: tweet.id, json: JSON.stringify(tweet)})
        .catch(err => {
          if (err.name === 'SequelizeUniqueConstraintError') {
            return; // ignore
          }
          throw err;
        });
    },
    get(from, to) {
      const where = {};

      if (from && to) {
        where.id = {$and: {$lt: to, $gt: from}};
      } else if (from) {
        where.id = {$gt: from};
      } else if (to) {
        console.log(to);
        where.id = {$lt: to};
      }

      return this.findAll({
        where,
        order: [['id', 'DESC']],
        limit: 20
      })
      .then(tweets => tweets.map(t => JSON.parse(t.get('json'))));
    }
  }
});

export default Tweet;
