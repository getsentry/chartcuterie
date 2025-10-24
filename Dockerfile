FROM node:20.19.5-bookworm AS builder

COPY package.json yarn.lock .
RUN yarn install --frozen-lockfile

COPY tsconfig.json .
COPY src src
RUN yarn build

FROM node:20.19.5-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libpangocairo-1.0-0 \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY fonts fonts
COPY --from=builder lib lib

RUN node lib/index.js --help

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
