# 本サイト

- 企画ページ「いいね」の CSRF トークン
- 時間外ページの切り替え

## Deployment

### Using Docker

```
$ docker build --tag rikoten-site .
$ docker run rikoten-site
```

## Using native Node.js

```
$ git clone --depth 1 $(cat site-repo.conf) site
$ npm i --production
$ npm run start
```
