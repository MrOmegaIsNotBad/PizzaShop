# Generated by Django 5.0.7 on 2024-08-14 11:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pizza', '0006_ingredient_product_ingredients'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='customer_name',
            new_name='username',
        ),
        migrations.RemoveField(
            model_name='order',
            name='customer_email',
        ),
    ]
