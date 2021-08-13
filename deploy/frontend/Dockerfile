FROM node:14.17.4-alpine3.12

COPY frontend/rpi_smart_calendar /frontend
WORKDIR /frontend
RUN yarn install && yarn build

FROM nginx:1.21.0
COPY deploy/nginx/templates /etc/nginx/templates
COPY --from=0 /frontend/build /usr/share/nginx/html