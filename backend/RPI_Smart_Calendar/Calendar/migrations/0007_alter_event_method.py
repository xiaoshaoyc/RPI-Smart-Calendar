# Generated by Django 3.2.5 on 2021-08-11 19:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Calendar', '0006_auto_20210811_1501'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='method',
            field=models.CharField(choices=[('sync', 'Sync'), ('manual', 'Manual')], default='sync', max_length=32),
        ),
    ]
