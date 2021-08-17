# RPI-Smart-Calendar

## prerequirment
* Ubuntu 20.04
* Docker version 20.10.8
* Docker-compose version 1.29.2

## Installation

```Bash
git clone https://github.com/xiaoshaoyc/RPI-Smart-Calendar.git RPISC

cd RPISC/deploy

cp template.env .env

vi .env  # edit the all the configs

docker-compose up --build -d

# enjoy
```