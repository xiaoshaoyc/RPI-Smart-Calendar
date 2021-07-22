#!/usr/bin/sh
set -o errexit

cd /RPI_Smart_Calendar/

echo 'Waiting database to start'
sleep 15s

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate --fake-initial

# create website superuser
echo "create superuser"
echo "from django.contrib.auth import get_user_model;User = get_user_model();" \
    "User.objects.create_superuser('$SUPERUSER_NAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWD')" \
    | python manage.py shell \
    || echo "Superuser $SUPERUSER_NAME already exist"

# Start server
echo "Starting server"
gunicorn -w 8 -b 0.0.0.0:20001 RPI_Smart_Calendar.wsgi --access-logfile - --error-logfile - --capture-output