yarn build;
scp -r /Users/huanchen/Project/out/coin-factory-frontend/dist/ root@42.193.192.16:/alidata1/BlockChain/static/
ssh root@42.193.192.16 "cd /alidata1/BlockChain/static/; rm -rf _coin-factory-frontend; mv uc _coin-factory-frontend; mv dist uc"