# Generated by Django 5.0.7 on 2024-08-15 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pizza', '0007_rename_customer_name_order_username_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.CharField(default=None, max_length=50),
        ),
    ]
