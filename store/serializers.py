# store/serializers.py
# ✅ ACTUALIZADO: Incluye campos es_nuevo, tiene_descuento, porcentaje_descuento

from rest_framework import serializers
from .models import Categoria, Producto

class ProductoSerializer(serializers.ModelSerializer):
    # Para mostrar el nombre de la categoría, no solo su ID
    categoria = serializers.StringRelatedField()
    # CORRECCIÓN: Devuelve la URL completa de la imagen
    imagen = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = (
            "id",
            "nombre",
            "slug",
            "categoria",
            "descripcion",
            "precio",
            "stock",
            "imagen",
            "es_nuevo",               # ✅ NUEVO
            "tiene_descuento",        # ✅ NUEVO
            "porcentaje_descuento",   # ✅ NUEVO
        )
    
    def get_imagen(self, obj):
        """
        Devuelve la URL completa de la imagen
        """
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            # Fallback si no hay request
            return obj.imagen.url
        return None

class CategoriaSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Categoria
        fields = (
            "id",
            "nombre",
            "slug",
            "productos",
        )