# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_SERVER_URL=""
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
ENV DISABLE_ESLINT_PLUGIN=true

RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine

RUN apk update && apk upgrade

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]