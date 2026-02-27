# canvas native module requires system libraries that conflict with DHI's
# pre-installed package versions (libexpat1 2.7.4 arch:all vs Debian's
# arch-specific build deps). Use standard node image for the build stage.
FROM node:24.14.0 AS builder

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

# canvas 3.x bundles its own libcairo, libpango, libgif, librsvg, etc. in
# node_modules/canvas/build/Release/, so no system canvas libraries are needed.
# The -dev variant is used because the minimal node:24-debian13 image lacks
# base system libs that canvas's bundled dependencies require (libz, libexpat,
# libuuid, liblzma).
FROM --platform=linux/amd64/v8 us-docker.pkg.dev/sentryio/dhi/node:24-debian13-dev

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY fonts fonts
COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/lib lib

RUN node lib/index.js --help

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
