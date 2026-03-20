FROM ghcr.io/getsentry/dhi/node:24-debian13-dev AS builder

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json .
COPY src src
RUN yarn build

# Drop devDependencies from node_modules for the runtime image
RUN yarn install --frozen-lockfile --production

# canvas 3.x bundles its graphics libs (libcairo, libpango, etc.) but some of
# those bundled libs still need system libs absent from the minimal runtime image.
# Use ldd to auto-detect all transitive system dependencies of every native module
# so this stays correct when canvas or any other native dependency is updated.
RUN mkdir -p /canvas-sys-libs && \
    find /build/node_modules -name "*.node" | \
    xargs ldd 2>/dev/null | \
    awk '/=> \// { print $3 }' | \
    grep -v '^/build' | \
    sort -u | \
    while IFS= read -r lib; do \
        real=$(readlink -f "$lib"); \
        cp --parents "$real" /canvas-sys-libs/ 2>/dev/null || true; \
        usr="${lib/#\/lib\//\/usr\/lib\/}"; \
        [ "$usr" != "$real" ] && \
            ln -sf "$(basename "$real")" "/canvas-sys-libs$usr" 2>/dev/null || true; \
    done

# canvas bundles libfontconfig but needs /etc/fonts/fonts.conf to initialise.
# Without it fontconfig silently fails and all text renders as box glyphs.
RUN apt-get update -qq && \
    apt-get install -qq -y --no-install-recommends fontconfig && \
    rm -rf /var/lib/apt/lists/*


FROM ghcr.io/getsentry/dhi/node:24-debian13

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY fonts fonts
COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/lib lib
COPY --from=builder /canvas-sys-libs/usr/lib/ /usr/lib/
COPY --from=builder /etc/fonts/ /etc/fonts/
COPY --from=builder /usr/share/fonts/ /usr/share/fonts/
COPY smoketest.js .

RUN ["node", "smoketest.js"]

EXPOSE 9090/tcp
CMD ["node", "./lib/index.js", "server", "9090"]
