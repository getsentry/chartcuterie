FROM node:24.14.0 AS builder

COPY package.json yarn.lock .
RUN yarn install --frozen-lockfile

COPY tsconfig.json .
COPY src src
RUN yarn build

FROM node:24.14.0-slim

ENV NODE_ENV=production

RUN npm install -g npm@latest \
    && npm install --prefix /usr/local/lib/node_modules/npm minimatch@">=10.2.3" \
    && npm cache clean --force

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
RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY fonts fonts
COPY --from=builder lib lib

RUN node lib/index.js --help

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
