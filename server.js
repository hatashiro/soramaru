import express from 'express';
import passport from 'passport';
import appConfig from './config/app';
import session from 'express-session';
import bodyParser from 'body-parser';
import twitterStrategy from './strategies/twitter';
import twitterRoute from './routes/twitter';
import archivesRoute from './routes/archives';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const RedisStore = require('connect-redis')(session);

app.use(session({
  secret: appConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore(),
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

app.get('/session', (req, res) => res.json(req.user));
app.delete('/session', (req, res) => {
  const logout = !!req.user;
  req.logout();
  res.json({ logout });
});

app.use('/twitter', twitterRoute);
app.use('/archives', archivesRoute);

app.listen(appConfig.port, () => {
  console.log(`listening to http://localhost:${appConfig.port}`);
});
