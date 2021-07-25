# Generated by Django 3.2.4 on 2021-07-24 09:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Group', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('addTime', models.DateTimeField(auto_now_add=True)),
                ('startTime', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True, verbose_name='start Time')),
                ('endTime', models.DateTimeField(default=django.utils.timezone.now, verbose_name='end Time')),
                ('method', models.CharField(choices=[('sync', 'Sync'), ('man', 'Manually')], max_length=4)),
                ('type', models.CharField(choices=[('block', 'Block'), ('line', 'Line')], max_length=6)),
                ('details', models.CharField(max_length=200)),
                ('estTime', models.IntegerField(default=0)),
                ('actualTime', models.IntegerField(default=0)),
                ('group', models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='Group.course')),
                ('user', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]