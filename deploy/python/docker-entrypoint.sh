#!/usr/bin/sh
set -o errexit

BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd /RPI_Smart_Calendar/

echo 'Waiting database to start'
sleep 12s

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

# create website superuser
echo "create superuser"
echo "from User.models import User;" \
    "User.objects.create_superuser('${SUPERUSER_NAME}', '${SUPERUSER_EMAIL}', '${SUPERUSER_PASSWD}')" \
    | python manage.py shell \
    || echo -e "${BLUE}Superuser ${SUPERUSER_NAME} already exist${NC}"

# Start server
echo "Starting server"
gunicorn -w 8 -b 0.0.0.0:20001 RPI_Smart_Calendar.wsgi --access-logfile - --error-logfile - --capture-output