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

FROM --platform=linux/amd64/v8 us-docker.pkg.dev/sentryio/dhi/node:24-debian13-dev

ENV NODE_ENV=production

# canvas requires these shared libraries at runtime; the minimal node:24-debian13
# image has no package manager, so we use the -dev variant.
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
