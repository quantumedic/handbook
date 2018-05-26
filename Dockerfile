FROM keymetrics/pm2:latest-alpine

RUN npm install -g babel-cli --registry=https://registry.npm.taobao.org

RUN mkdir -p /opt/www/server
COPY . /opt/www/server
WORKDIR /opt/www/server

RUN npm install --registry=https://registry.npm.taobao.org


EXPOSE 3000
CMD pm2-runtime start ecosystem.json