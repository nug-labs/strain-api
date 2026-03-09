FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src

RUN npm install && npm run build

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY assets ./assets

EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/index.js"]
