FROM node:18-alpine3.17

WORKDIR /usr/src/app

RUN apk add --no-cache \
    python3 \
    build-base \
    openjdk17 \
    libc6-compat \
    && ln -sf python3 /usr/bin/python

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --build-from-source

RUN pnpm rebuild bcrypt --build-from-source

COPY . .

RUN pnpm run erd

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
