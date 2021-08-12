FROM python:3.9.6
EXPOSE 20001

COPY 
COPY ["backend/*", "deploy/python/*", "/RPI_Smart_Calendar/"]

WORKDIR /RPI_Smart_Calendar
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt \
    && chmod 555 docker-entrypoint.sh
ENTRYPOINT sh docker-entrypoint.sh