rm -rf dist
yarn build;
scp -r /Users/huanchen/Project/out/coin-factory-frontend/dist/ root@43.129.159.116:/BlockChain/static/
ssh root@43.129.159.116 "cd /BlockChain/static/; rm -rf _coin-factory-frontend; mv uc _coin-factory-frontend; mv dist uc"
