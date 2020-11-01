# 本サイト

- 企画ページ「いいね」の CSRF トークン
- 時間外ページの切り替え

## Deployment

### Using Docker

Firebase の設定ファイルを `firebase.json` とする。

```
$ docker build --tag rikoten-site .
$ docker run -p 8080:8080 -d --name rikten-site --restart always rikoten-site
```
