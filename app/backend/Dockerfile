# STAGE 1
FROM node:26-bookworm AS builder

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src/ ./src

RUN npm install
RUN npm run build

# STAGE 2
FROM node:26-bookworm

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD [ "node", "./dist/index.js" ]
