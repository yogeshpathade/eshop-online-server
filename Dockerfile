FROM node:8

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

WORKDIR /opt/eshop-online-server

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "run"]

CMD ["start"]