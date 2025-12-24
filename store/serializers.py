# store/serializers.py

from rest_framework import serializers
from .models import Categoria, Producto, Pedido, PedidoItem


class ProductoSerializer(serializers.ModelSerializer):
    # 🔹 Para mostrar el nombre de la categoría (solo lectura)
    categoria = serializers.StringRelatedField(read_only=True)

    # 🔹 Para escribir la categoría por ID (campo write-only)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        source='categoria',
        write_only=True
    )

    # 🔹 ImageField normal (lectura/escritura)
    imagen = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Producto
        fields = (
            "id",
            "nombre",
            "slug",
            "categoria",        # nombre de la categoría (read-only)
            "categoria_id",     # id de categoría (write-only)
            "descripcion",
            "precio",
            "stock",
            "imagen",
            "es_nuevo",
            "tiene_descuento",
            "porcentaje_descuento",
        )

    def to_representation(self, instance):
        """
        Sobrescribimos para devolver la URL absoluta de la imagen.
        """
        data = super().to_representation(instance)
        request = self.context.get('request')

        imagen = data.get('imagen')
        if imagen and request:
            # Si es una ruta relativa, la convertimos en absoluta
            if not imagen.startswith('http://') and not imagen.startswith('https://'):
                data['imagen'] = request.build_absolute_uri(imagen)

        return data


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


# ==============================
# NUEVOS SERIALIZERS DE PEDIDOS
# ==============================

class PedidoItemSerializer(serializers.ModelSerializer):
    # En el request esperamos el ID de producto
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())

    class Meta:
        model = PedidoItem
        fields = ("producto", "cantidad", "precio_unitario")


class PedidoSerializer(serializers.ModelSerializer):
    items = PedidoItemSerializer(many=True)

    class Meta:
        model = Pedido
        fields = (
            "id",
            "user_uid",
            "email",
            "nombre_cliente",
            "direccion",
            "total",
            "metodo_pago",
            "creado_en",
            "items",
        )
        read_only_fields = ("id", "creado_en")

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        pedido = Pedido.objects.create(**validated_data)
        for item_data in items_data:
            PedidoItem.objects.create(pedido=pedido, **item_data)
        return pedido
