FROM us-docker.pkg.dev/sentryio/dhi/node:24-debian13-dev AS builder

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
FROM us-docker.pkg.dev/sentryio/dhi/node:24-debian13-dev

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY fonts fonts
COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/lib lib

RUN node lib/index.js --help

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
