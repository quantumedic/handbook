git add *
git commit -am $1
git push
docker build -t qianchen245/yeejuan-server .
docker push qianchen245/yeejuan-server:latest