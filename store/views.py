# store/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Categoria, Producto, Pedido
from .serializers import (
    CategoriaSerializer,
    ProductoSerializer,
    PedidoSerializer,
)


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Ver todas las categorías con sus productos.
    """
    queryset = Categoria.objects.all().prefetch_related('productos')
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'

    def get_serializer_context(self):
        return {'request': self.request}


class ProductoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de productos + acción para disminuir stock.
    """
    serializer_class = ProductoSerializer
    lookup_field = 'slug'

    # 🔹 Aceptar multipart/form-data para subir imágenes
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        qs = Producto.objects.all()
        # Para la lista solo mostramos productos disponibles
        if self.action == 'list':
            qs = qs.filter(disponible=True)
        return qs

    def get_serializer_context(self):
        return {'request': self.request}

    # Acción para disminuir stock (usada desde el checkout)
    @action(detail=True, methods=['post'])
    def disminuir_stock(self, request, slug=None):
        """
        POST /api/v1/productos/<slug>/disminuir_stock/
        Body JSON: { "cantidad": 3 }
        """
        producto = self.get_object()

        try:
            cantidad = int(request.data.get('cantidad', 0))
        except (TypeError, ValueError):
            return Response(
                {"detail": "Cantidad inválida."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cantidad <= 0:
            return Response(
                {"detail": "La cantidad debe ser mayor a 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if producto.stock < cantidad:
            return Response(
                {"detail": "Stock insuficiente."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        producto.stock -= cantidad
        producto.save()

        serializer = self.get_serializer(producto)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PedidoViewSet(viewsets.ModelViewSet):
    """
    CRUD de pedidos. Por ahora dejamos acceso abierto.
    """
    queryset = Pedido.objects.all().order_by('-creado_en')
    serializer_class = PedidoSerializer
    lookup_field = 'id'
