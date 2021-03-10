FROM node:14-slim

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
