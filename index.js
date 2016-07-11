import express from 'express';
import passport from 'passport';
import appConfig from './config/app';
import session from 'express-session';
import bodyParser from 'body-parser';
import twitterStrategy from './strategies/twitter';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: appConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(twitterStrategy);

app.get('/', (req, res) => {
  res.send(JSON.stringify(req.user));
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.listen(appConfig.port, () => {
  console.log(`listening to http://localhost:${appConfig.port}`);
});
