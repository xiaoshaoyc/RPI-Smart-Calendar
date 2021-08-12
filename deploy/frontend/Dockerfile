FROM node:14.17.4-alpine3.12

COPY frontend/rpi_smart_calendar /frontend
WORKDIR /frontend
RUN yarn install && yarn build

FROM python:3.9.6
EXPOSE 20001

COPY ["backend/*", "/RPI_Smart_Calendar/"]

WORKDIR /RPI_Smart_Calendar
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt \
    && python manage.py collectstatic

FROM nginx:1.21.0
COPY deploy/nginx/templates /etc/nginx/templates
COPY --from=0 /frontend/build /usr/share/nginx/html
COPY --from=1 /django-static /usr/share/nginx/html/static