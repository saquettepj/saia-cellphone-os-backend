FROM node:18-alpine3.20

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
