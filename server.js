import express from 'express';
import passport from 'passport';
import appConfig from './config/app';
import session from 'express-session';
import bodyParser from 'body-parser';
import twitterStrategy from './strategies/twitter';
import twitterRoute from './routes/twitter';
import { client as redisClient} from './lib/redis';
import { pick } from 'lodash';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const RedisStore = require('connect-redis')(session);

app.use(session({
  secret: appConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient }),
  cookie: { maxAge: appConfig.sessionMaxAge }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(twitterStrategy);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/session', (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }
  res.json(pick(req.user, ['id', 'username', 'thumbnail']));
});
app.delete('/session', (req, res) => {
  const logout = !!req.user;
  req.logout();
  res.json({ logout });
});

app.use('/twitter', twitterRoute);

app.use(appConfig.archiveURI, express.static(appConfig.archiveDir));

if (process.env.NODE_ENV !== 'production') {
  require('./build/dev-server')(app);
} else {
  const dist = require('./config').build.assetsRoot;
  app.use(express.static(dist));
  app.use((req, res) => res.sendFile('index.html', { root: dist }));
}

app.listen(appConfig.port, () => {
  console.log(`listening to http://127.0.0.1:${appConfig.port}`);
});
