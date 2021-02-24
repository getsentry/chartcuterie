FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN NODE_ENV=production yarn build

EXPOSE 8000
