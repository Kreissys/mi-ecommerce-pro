# store/models.py

from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    categoria = models.ForeignKey(
        Categoria,
        related_name='productos',
        on_delete=models.CASCADE
    )
    nombre = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    # 🔹 Campo de imagen ya correcto
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    disponible = models.BooleanField(default=True)

    # Campos extra que ya manejas
    es_nuevo = models.BooleanField(default=False)
    tiene_descuento = models.BooleanField(default=False)
    porcentaje_descuento = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.nombre


# ==============================
# NUEVOS MODELOS DE PEDIDOS
# ==============================

class Pedido(models.Model):
    """
    Pedido almacenado en MySQL.
    Lo ligamos al usuario por su UID de Firebase.
    """
    user_uid = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField()
    nombre_cliente = models.CharField(max_length=255)
    direccion = models.TextField(blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return f"Pedido {self.id} - {self.email}"


class PedidoItem(models.Model):
    """
    Ítems del pedido (detalle).
    """
    pedido = models.ForeignKey(
        Pedido,
        related_name='items',
        on_delete=models.CASCADE
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"
