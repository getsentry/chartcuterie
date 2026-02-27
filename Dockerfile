FROM us-docker.pkg.dev/sentryio/dhi/node:24-debian13-dev AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json .
COPY src src
RUN yarn build

FROM us-docker.pkg.dev/sentryio/dhi/node:24-debian13

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
        libcairo2 \
        libpango-1.0-0 \
        libjpeg62-turbo \
        libgif7 \
        librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./
COPY fonts fonts
COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/lib lib

RUN node lib/index.js --help

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
