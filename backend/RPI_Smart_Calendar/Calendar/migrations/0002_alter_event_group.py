# Generated by Django 3.2.4 on 2021-07-24 10:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Group', '0003_mygroup_group_id'),
        ('Calendar', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='group',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='Group.mygroup'),
        ),
    ]
