# store/views.py
# Archivo completo CORREGIDO

from rest_framework import viewsets
from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet para ver todas las categorías,
    incluyendo sus productos anidados.
    """
    queryset = Categoria.objects.all().prefetch_related('productos')
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        """
        Pasa el request al serializer para construir URLs absolutas
        """
        return {'request': self.request}

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet para ver todos los productos.
    """
    queryset = Producto.objects.filter(disponible=True)
    serializer_class = ProductoSerializer
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        """
        Pasa el request al serializer para construir URLs absolutas
        """
        return {'request': self.request}