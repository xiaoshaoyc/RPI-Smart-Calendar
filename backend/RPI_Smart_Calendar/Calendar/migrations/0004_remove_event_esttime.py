# Generated by Django 3.2.4 on 2021-07-25 01:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Calendar', '0003_alter_event_actualtime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='estTime',
        ),
    ]