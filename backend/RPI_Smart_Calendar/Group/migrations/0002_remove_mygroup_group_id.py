# Generated by Django 3.2.4 on 2021-07-24 10:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Group', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mygroup',
            name='group_id',
        ),
    ]