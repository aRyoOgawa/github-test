# release-script

main への release ブランチマージ、pacakge.json のバージョンアップ、タグの作成等を行うリリース用スクリプト

## 環境

Node.js v20.3.1

## 実行方法

1. `npm install` を実行
2. `npm run release` を実行
3. プロンプトで release type (major, minor, patch) を選択

```
❯ npm run release

> release-tool@1.0.0 release
> node index.mjs

? Select release type (Use arrow keys)
❯ major
  minor
  patch

? Release major version (y/N)
```
