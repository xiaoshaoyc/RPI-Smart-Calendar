# Generated by Django 3.2.4 on 2021-07-24 10:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Group', '0001_initial'),
        ('User', '0002_auto_20210724_1704'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='groups',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Group.mygroup'),
        ),
    ]
