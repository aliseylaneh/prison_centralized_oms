# Generated by Django 3.2.7 on 2021-10-14 11:48

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0007_alter_user_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 14, 15, 18, 51, 937786)),
        ),
    ]
