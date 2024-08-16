"""
URL configuration for shops project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from pizza import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', views.index, name="index"),
    path('account/', views.account, name="account"),

    path('login/', views.login, name="login"),
    path('register/', views.register, name="register"),
    path('logout/', views.logout, name="logout"),

    path('api/get-products-list/', views.get_products_list, name='get-products-list'),
    path('api/get-filters-list/', views.get_filters_list, name='get-filters-list'),
    path('api/get-orders-by-user-id/', views.get_orders_by_user_id, name='get-orders-by-user-id'),
    
    path('api/push-order/', views.push_order, name='push-order'),
    path('api/user-detail-change/', views.user_detail_change, name='user-detail-change'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
