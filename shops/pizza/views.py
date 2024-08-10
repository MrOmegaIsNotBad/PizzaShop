from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import *
from django.db.models import *

from urllib.parse import unquote
import json

# Create your views here.
'''
def index(request):
    template = loader.get_template('index.html')

    filter_ingredients = unquote(request.GET.get('ingredients', '')).split('+')
    ingredients_in_filter = Ingredient.objects.filter(name__in=filter_ingredients)
    ingredients_ids = ingredients_in_filter.values_list('id', flat=True)

    products = Product.objects.all()
    ingredients = Ingredient.objects.all()

    if filter_ingredients != ['']:
        products = products.filter(
            ingredients__in=ingredients_ids
        ).annotate(
            num_ingredients=Count('ingredients')
        ).filter(
            num_ingredients=len(ingredients_ids)
        )

        ingredients = ingredients.annotate(
            filter_active=Case(
                When(name__in=filter_ingredients, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        )

        for i in ingredients:
            if i.name in filter_ingredients:
                i.filter_active = True

    #products = Product.objects.all()
    #ingredients = Ingredient.objects.all()
    context = {
        'products': products,
        'ingredients': ingredients
    }
    return HttpResponse(template.render(context, request))
'''

@ensure_csrf_cookie
def index(request):
    template = loader.get_template('index.html')
    ingredients = Ingredient.objects.all()
    
    context = {
        'ingredients': ingredients,
    }
    return HttpResponse(template.render(context, request))


def get_products_list(request):
    if request.method in ['POST', 'GET']:
        try:
            #request_data = json.loads(request.body)
            
            responce_data = []
            products = Product.objects.all()
            for p in products:
                responce_data.append({
                    'id': p.id,
                    'name': p.name,
                    'description': p.description,
                    'ingredients': [ingredient.name for ingredient in p.ingredients.all()],
                    'price': p.price,
                    'image': p.image.url if p.image else None,
                })

            return JsonResponse({'status': 'success', 'result': responce_data}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def get_filters_list(request):
    if request.method in ['POST', 'GET']:
        try:
            responce_data = {'ingredients':[]}
            ingredients = Ingredient.objects.all()
            for i in ingredients:
                responce_data['ingredients'].append(i.name)

            return JsonResponse({'status': 'success', 'result': responce_data}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


'''
def filter_procces(request): 
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            template = loader.get_template('index.html')

            # filter ingredients 
            ingredients = Ingredient.objects.filter(name__in=data['ingredients'])
            ingredients_ids = ingredients.values_list('id', flat=True)

            products = Product.objects.filter(ingredients__in=ingredients_ids).annotate(num_ingredients=Count('ingredients')).filter(num_ingredients=len(ingredients_ids))

            #products = Product.objects.filter(ingredients__in=data['ingredients']).values()
            #ingredients = Ingredient.objects.all()

            products = products.values()

            context = {
                'products': products,
                'ingredients': ingredients
            }


            return HttpResponse(template.render(context, request)) 
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
'''


def add_product_in_basket(request):
    pass
