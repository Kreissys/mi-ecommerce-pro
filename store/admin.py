# store/admin.py

from django.contrib import admin
from .models import Categoria, Producto, Pedido, PedidoItem


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "slug")
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nombre",
        "categoria",
        "precio",
        "stock",
        "disponible",      # <- AQUÍ YA NO USAMOS 'creado'
    )
    list_filter = ("categoria", "disponible", "es_nuevo", "tiene_descuento")
    search_fields = ("nombre", "slug")


class PedidoItemInline(admin.TabularInline):
    model = PedidoItem
    extra = 0


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "total", "metodo_pago", "creado_en")
    list_filter = ("metodo_pago", "creado_en")
    search_fields = ("email", "nombre_cliente", "user_uid")
    inlines = [PedidoItemInline]
