from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Product)
class PizzaAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'product', 'quantity', 'order_date')

@admin.register(UserDetail)
class UserDetailAdmin (admin.ModelAdmin):
    list_display = ('user_id', 'username')