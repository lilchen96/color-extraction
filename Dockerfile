FROM node:16.14.2-bullseye-slim AS build-stage

WORKDIR /app

COPY . .

RUN npm install --registry https://registry.npmmirror.com

RUN npm run clean

RUN npm run build

FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/public/ /usr/share/nginx/html/
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/nginx.template

EXPOSE 80

ENTRYPOINT ["/bin/sh", "-c", "envsubst '$$PROXY_1_LOCATION $$PROXY_1_URL' < /etc/nginx/conf.d/nginx.template > /etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
