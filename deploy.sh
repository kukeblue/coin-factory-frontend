yarn build;
scp -r /Users/huanchen/Project/out/tms/dist root@chtms:/opt/nginx/
ssh root@chtms "cd /opt/nginx/; rm -rf _tms-frontend; mv tms-frontend _tms-frontend;mv dist tms-frontend"
