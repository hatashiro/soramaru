import Twit from 'twit';

const twitter = new Twit(require('../config/twitter.json'));

export default twitter;
