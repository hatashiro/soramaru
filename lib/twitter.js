import Twit from 'twit';
import {clone, extend, filter} from 'lodash';

const twitter = new Twit(require('../config/twitter.json'));

async function fromRawTweet(rawTweet) {
  const images = rawTweet.entities.media.filter(m => m.type === 'photo');
  return {
    id: rawTweet.id,
    text: rawTweet.text,
    user: fromRawUser(rawTweet.user),
    images: await Promise.all(images.map(async image => {
      // TODO: download image and replace url
      return image.media_url;
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
  // TODO: request throattle
  const opts = clone(require('../config/list.json'));
  opts.count = 200;
  if (from) {
    opts.since_id = from;
  }
  if (to) {
    opts.max_id = to;
  }

  const res = await twitter.get('lists/statuses', opts);
  // TODO: append log

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

  return filter(tweets);
}
