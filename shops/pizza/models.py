from django.db import models

# Create your models here.

class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient)
    price = models.FloatField(null=True)
    image = models.ImageField(upload_to='media')

    def __str__(self):
        return self.name

class Order(models.Model):
    user_id = models.IntegerField(null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default=None)

    def __str__(self):
        return f'Order {self.id} by {self.user_id}'

class UserDetail(models.Model):
    user_id = models.IntegerField(null=True)
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=200)