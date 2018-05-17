# 星云链部署学习笔记

## 获取主网状态
curl -i -H 'Content-Type:application/json' -X GET https://testnet.nebulas.io/v1/user/nebstate

## 获取账户状态
curl -i -H Accept:application/json -X POST https://mainnet.nebulas.io/v1/user/accountstate -d {\"address\":\"n1SifsSwtQG1AK8wT1Gnfk3YaKPnHKadoNv\"}