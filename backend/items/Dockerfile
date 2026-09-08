# --- deps stage: trivy is picking up a lot of vulnearbilities in npm, but those are not needed at runtime ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN apk update && apk upgrade && npm ci --omit=dev

# --- runtime stage: no npm needded, just node +  code---
FROM node:22-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn-v*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3003
CMD ["node", "-r", "./tracing.js", "server.js"]