FROM node:19

WORKDIR /app

COPY package*.json /app/

RUN yarn install

COPY . /app/

CMD [ "yarn", "start" ]