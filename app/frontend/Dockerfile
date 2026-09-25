FROM nginx:1.31.6-alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
COPY /run/secrets/ssl_key /etc/nginx/ssl/ssl.key
COPY /run/secrets/ssl_crt /etc/nginx/ssl/ssl.crt

