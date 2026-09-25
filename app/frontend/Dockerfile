FROM nginx:1.31.6-alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
COPY ssl.key /etc/nginx/ssl/ssl.key
COPY ssl.crt /etc/nginx/ssl/ssl.crt

