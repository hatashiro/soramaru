import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import Tweet from './models/tweet';
import {getTweets} from './lib/twitter';
import {get} from 'koa-route';

const app = new Koa();

app.use(get('/', async ctx => {
  ctx.body = 'hello, world!';
}));

app.use(get('/tweets', async ctx => {
  const {from, to} = ctx.query;
  let tweets = await Tweet.get(from, to);

  if (tweets.length !== 0) {
    ctx.body = tweets;
    return;
  }

  tweets = await getTweets(from, to);
  await Promise.all(tweets.map(t => Tweet.insert(t)));
  ctx.body = tweets;
}));

app.use(mount('/archives', serve(__dirname + '/archives')));

app.listen(3000, () => {
  console.log('listening to http://localhost:3000');
});

setInterval(async () => {
  const latest = await Tweet.latest();
  const tweets = await getTweets(latest && latest.get('id'));
  await Promise.all(tweets
    .filter(t => +t.id !== +latest.get('id'))
    .map(t => Tweet.insert(t)));

  // TODO: update clients automatically
}, 15000)
