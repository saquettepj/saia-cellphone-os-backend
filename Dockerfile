FROM node:18-alpine3.17

WORKDIR /usr/src/app

RUN apk add --no-cache openjdk17

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run erd
RUN pnpm run build

EXPOSE 3000
