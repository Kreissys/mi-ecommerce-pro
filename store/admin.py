# store/admin.py
# Archivo completo para copiar y pegar

from django.contrib import admin
from .models import Categoria, Producto

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug')
    # Esto hace que el slug se auto-rellene mientras escribes el nombre
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'stock', 'disponible', 'creado')
    list_filter = ('categoria', 'disponible')
    list_editable = ('precio', 'stock', 'disponible') # ¡Muy útil!
    prepopulated_fields = {'slug': ('nombre',)}
    search_fields = ('nombre', 'descripcion')