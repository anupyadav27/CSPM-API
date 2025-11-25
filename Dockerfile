

ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

RUN apk add --no-cache chromium

COPY package*.json ./
RUN npm install --production

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
