FROM python:3.9.6
EXPOSE 20001

COPY backend/* /RPI_Smart_Calendar/
COPY deploy/python/* /RPI_Smart_Calendar/

WORKDIR /RPI_Smart_Calendar
RUN pip install -r requirements.txt && chmod 555 docker-entrypoint.sh
ENTRYPOINT sh docker-entrypoint.sh