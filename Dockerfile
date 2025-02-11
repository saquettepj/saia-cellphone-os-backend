FROM node:18-alpine3.17

WORKDIR /usr/src/app

RUN apk add --no-cache \
    python3 \
    build-base \
    openjdk17 \
    && ln -sf python3 /usr/bin/python

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install

RUN pnpm run erd

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
