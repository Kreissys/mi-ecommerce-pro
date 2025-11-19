# store/models.py
# Archivo completo para copiar y pegar

from django.db import models
from django.utils.text import slugify

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    # 'slug' es un nombre amigable para la URL (ej: "juegos-de-estrategia")
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre

    # Esta función crea el 'slug' automáticamente
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, related_name='productos', on_delete=models.CASCADE, verbose_name="Categoría")
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    # Este es tu "gestión de inventarios"
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    # Este es el requisito de "logo" (pero para producto)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True, verbose_name="Imagen")
    disponible = models.BooleanField(default=True, verbose_name="Disponible")
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)
    es_nuevo = models.BooleanField(default=False)
    tiene_descuento = models.BooleanField(default=False)
    porcentaje_descuento = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ('-creado',) # Los productos más nuevos primero

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)