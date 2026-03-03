FROM us-docker.pkg.dev/sentryio/dhi/node:24-debian13-dev AS builder

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json .
COPY src src
RUN yarn build

# Drop devDependencies from node_modules for the runtime image
RUN yarn install --frozen-lockfile --production

# canvas 3.x bundles its graphics libs (libcairo, libpango, etc.) but its
# bundled librsvg/glib still need a few basic system libs absent from the
# minimal runtime image. Collect them here to copy in without pulling the
# entire -dev system into the runtime.
RUN mkdir -p /canvas-sys-libs && \
    find /lib /usr/lib -maxdepth 3 \( \
        -name "libz.so.1*" -o \
        -name "libexpat.so.1*" -o \
        -name "libuuid.so.1*" -o \
        -name "liblzma.so.5*" \
    \) -exec cp -P --parents {} /canvas-sys-libs/ \;

# canvas bundles libfontconfig but needs /etc/fonts/fonts.conf to initialise.
# Without it fontconfig silently fails and all text renders as box glyphs.
RUN apt-get update -qq && \
    apt-get install -qq -y --no-install-recommends fontconfig && \
    rm -rf /var/lib/apt/lists/*


FROM us-docker.pkg.dev/sentryio/dhi/node:24-debian13

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY fonts fonts
COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/lib lib
COPY --from=builder /canvas-sys-libs/ /
COPY --from=builder /etc/fonts/ /etc/fonts/
COPY --from=builder /usr/share/fonts/ /usr/share/fonts/

RUN ["node", "lib/index.js", "--help"]

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
