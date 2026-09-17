FROM node:26-bookworm-slim

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY dist ./

CMD [ "npm", "run", "start" ]
