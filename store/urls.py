# store/urls.py
# Archivo completo para copiar y pegar

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ProductoViewSet

# Creamos un router de Django Rest Framework
router = DefaultRouter()

# Registramos nuestras Vistas con el router
# 'categorias' será la URL base (ej: /api/v1/categorias/)
router.register(r'categorias', CategoriaViewSet, basename='categoria')
# 'productos' será la URL base (ej: /api/v1/productos/)
router.register(r'productos', ProductoViewSet, basename='producto')

# Las URLs de la API son generadas automáticamente por el router
urlpatterns = [
    path('', include(router.urls)),
]