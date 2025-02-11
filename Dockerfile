FROM node:18-bullseye

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/python3 /usr/bin/python

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run erd

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
