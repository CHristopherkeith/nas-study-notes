# 星云链部署学习笔记

## 获取主网状态
curl -i -H 'Content-Type:application/json' -X GET https://testnet.nebulas.io/v1/user/nebstate

## 获取账户状态

### 测试网
curl -i -H Accept:application/json -X POST https://testnet.nebulas.io/v1/user/accountstate -d {\"address\":\"n1NgXVjAfGABv7BJnH6BC65jTkdPv4TVet1\"}

### 主网
curl -i -H Accept:application/json -X POST https://mainnet.nebulas.io/v1/user/accountstate -d {\"address\":\"n1NgXVjAfGABv7BJnH6BC65jTkdPv4TVet1\"}

## 获取所有账户
curl -i -H 'Content-Type:application/json' -X GET https://mainnet.nebulas.io/v1/admin/accounts


## 新建账户
curl -i -H 'Content-Type:application/json' -X POST https://mainnet.nebulas.io/v1/admin/account/new -d {\"passphrase\":\"passphrase\"}


## 解锁账户

curl -i -H 'Content-Type:application/json' -X POST https://mainnet.nebulas.io/v1/admin/account/unlock -d {\"address\":\"n1H4MYms9F55ehcvygwWE71J8tJC4CRr2so\",\"passphrase\":\"passphrase\",\"duration\":\"43200000000000\"}

## 锁定账户

curl -i -H 'Content-Type: application/json' -X POST https://localhost:8685/v1/admin/account/lock -d '{"address":"n1czGUvbQQton6KUWga4wKDLLKYDEn39mEk"}'

# 该项目前端框架使用vue，启动命令如下

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
