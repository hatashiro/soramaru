import Twit from 'twit';
import download from './download';
import moment from 'moment';
import Log from '../models/log';
import sleep from './sleep';
import {clone, extend, filter, last} from 'lodash';
import {join, extname} from 'path';

const twitter = new Twit(require('../config/twitter.json'));

async function fromRawTweet(rawTweet) {
  const images = rawTweet.entities.media.filter(m => m.type === 'photo');
  return {
    id: rawTweet.id,
    text: rawTweet.text,
    user: fromRawUser(rawTweet.user),
    datetime: moment(new Date(rawTweet.created_at)).format(),
    images: await Promise.all(images.map(async (image, idx) => {
      const path = `archives/${rawTweet.id}/${idx + 1}${extname(image.media_url)}`;
      await download(image.media_url, path);
      return `/${path}`;
    }))
  };
}

function fromRawUser(rawUser) {
  return {
    id: rawUser.id,
    name: rawUser.name,
    screenName: rawUser.screen_name,
    profileImage: rawUser.profile_image_url
  };
}

export async function getTweets(from, to) {
  const latestLog = await Log.latest();

  if (latestLog) {
    const diff = +moment() - +moment(latestLog.get('createdAt'));
    if (diff < 5000) {
      await sleep(diff + 1000);
    }
  }

  const opts = clone(require('../config/list.json'));
  opts.count = 200;
  if (from) {
    opts.since_id = from;
  }
  if (to) {
    opts.max_id = to;
  }

  const res = await twitter.get('lists/statuses', opts);
  await Log.create({
    from,
    to,
    resultFrom: res.data.length > 0 ? last(res.data).id : null,
    resultTo: res.data.length > 0 ? res.data[0].id : null
  });

  const tweets = await Promise.all(res.data.map(async tweet => {
    if (!tweet.entities.media || tweet.entities.media.every(m => m.type !== 'photo')) {
      return;
    }

    if (tweet.retweet_status) {
      return extend(await fromRawTweet(tweet.retweet_status), {
        retweetedBy: fromRawUser(tweet.user)
      });
    }

    return await fromRawTweet(tweet);
  }));

  if (res.data.length !== 0 && tweets.length === 0 && !from && to) {
    return getTweets(null, resultFrom);
  }

  return filter(tweets);
}
