# そらまる

> pronounced as *soramaru*

<img width='200' src='https://cloud.githubusercontent.com/assets/1013641/17025345/5ef2ba76-4f96-11e6-8436-5bfc4dac4af1.jpg'>

A Twitter list viewer for images

## Configuration

Running Redis instance is needed.

Following files should exist in `config`. Please refer to their samples, or you
can just start by copying them.

- `config/app.js`
- `config/twitter.js`

```
cp config/app.sample.js config/app.js
```


## Guide

Clone the repo:

```
git clone https://github.com/noraesae/soramaru.git
cd soramaru
```

Install dependencies:

```
yarn
```

Run a dev server:

```
node .
```

Build production assets:

```
yarn build
```

Run a production server:

```
NODE_ENV=production node .
```

## License

[MIT](LICENSE)
