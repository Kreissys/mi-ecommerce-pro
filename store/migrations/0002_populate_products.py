# store/migrations/0002_populate_products.py
# Archivo completo, corregido del typo 'cat_estrategIA'

from django.db import migrations
from decimal import Decimal
from django.utils.text import slugify

# Esta función es la que añade los datos
def populate_data(apps, schema_editor):
    # Obtenemos los modelos de la app 'store'
    Categoria = apps.get_model('store', 'Categoria')
    Producto = apps.get_model('store', 'Producto')

    # --- 1. CREAR CATEGORÍAS ---
    cat_estrategia, _ = Categoria.objects.get_or_create(nombre="Estrategia", defaults={'slug': 'estrategia'})
    cat_familiares, _ = Categoria.objects.get_or_create(nombre="Familiares", defaults={'slug': 'familiares'})
    cat_cartas, _ = Categoria.objects.get_or_create(nombre="Juegos de Cartas", defaults={'slug': 'juegos-de-cartas'})
    cat_rol, _ = Categoria.objects.get_or_create(nombre="Juegos de Rol (RPG)", defaults={'slug': 'juegos-de-rol-rpg'})
    cat_fiesta, _ = Categoria.objects.get_or_create(nombre="Juegos de Fiesta (Party)", defaults={'slug': 'juegos-de-fiesta-party'})

    # --- 2. CREAR PRODUCTOS ---
    
    # Lista de productos a crear
    productos_a_crear = [
        # Estrategia (10)
        {'categoria': cat_estrategia, 'nombre': 'Catan', 'precio': Decimal('180.00'), 'stock': 25},
        {'categoria': cat_estrategia, 'nombre': 'Risk', 'precio': Decimal('150.00'), 'stock': 20},
        {'categoria': cat_estrategia, 'nombre': 'Carcassonne', 'precio': Decimal('130.00'), 'stock': 30},
        {'categoria': cat_estrategia, 'nombre': 'Terraforming Mars', 'precio': Decimal('250.00'), 'stock': 15},
        {'categoria': cat_estrategia, 'nombre': 'Gloomhaven', 'precio': Decimal('550.00'), 'stock': 5},
        {'categoria': cat_estrategia, 'nombre': 'Scythe', 'precio': Decimal('320.00'), 'stock': 10},
        {'categoria': cat_estrategia, 'nombre': '7 Wonders', 'precio': Decimal('200.00'), 'stock': 20},
        {'categoria': cat_estrategia, 'nombre': 'Azul', 'precio': Decimal('160.00'), 'stock': 25},
        {'categoria': cat_estrategia, 'nombre': 'Wingspan', 'precio': Decimal('230.00'), 'stock': 18},
        
        # --- (AQUÍ ESTABA EL ERROR, YA CORREGIDO) ---
        {'categoria': cat_estrategia, 'nombre': 'Root', 'precio': Decimal('280.00'), 'stock': 12}, 

        # Familiares (10)
        {'categoria': cat_familiares, 'nombre': 'Ticket to Ride', 'precio': Decimal('190.00'), 'stock': 30},
        {'categoria': cat_familiares, 'nombre': 'Dixit', 'precio': Decimal('140.00'), 'stock': 35},
        {'categoria': cat_familiares, 'nombre': 'Monopoly', 'precio': Decimal('80.00'), 'stock': 50},
        {'categoria': cat_familiares, 'nombre': 'Clue', 'precio': Decimal('70.00'), 'stock': 40},
        {'categoria': cat_familiares, 'nombre': 'Jenga', 'precio': Decimal('60.00'), 'stock': 60},
        {'categoria': cat_familiares, 'nombre': 'Uno', 'precio': Decimal('30.00'), 'stock': 100},
        {'categoria': cat_familiares, 'nombre': 'Scrabble', 'precio': Decimal('90.00'), 'stock': 30},
        {'categoria': cat_familiares, 'nombre': 'Sequence', 'precio': Decimal('85.00'), 'stock': 25},
        {'categoria': cat_familiares, 'nombre': 'King of Tokyo', 'precio': Decimal('150.00'), 'stock': 20},
        {'categoria': cat_familiares, 'nombre': 'Dobble', 'precio': Decimal('50.00'), 'stock': 40},

        # Juegos de Cartas (10)
        {'categoria': cat_cartas, 'nombre': 'Magic: The Gathering (Booster)', 'precio': Decimal('20.00'), 'stock': 200},
        {'categoria': cat_cartas, 'nombre': 'Pokémon TCG (Booster)', 'precio': Decimal('22.00'), 'stock': 150},
        {'categoria': cat_cartas, 'nombre': 'Yu-Gi-Oh! (Booster)', 'precio': Decimal('18.00'), 'stock': 180},
        {'categoria': cat_cartas, 'nombre': 'Exploding Kittens', 'precio': Decimal('90.00'), 'stock': 50},
        {'categoria': cat_cartas, 'nombre': 'Unstable Unicorns', 'precio': Decimal('95.00'), 'stock': 45},
        {'categoria': cat_cartas, 'nombre': 'The Mind', 'precio': Decimal('60.00'), 'stock': 30},
        {'categoria': cat_cartas, 'nombre': 'Sushi Go Party!', 'precio': Decimal('85.00'), 'stock': 40},
        {'categoria': cat_cartas, 'nombre': 'Coup', 'precio': Decimal('50.00'), 'stock': 60},
        {'categoria': cat_cartas, 'nombre': 'Love Letter', 'precio': Decimal('40.00'), 'stock': 70},
        {'categoria': cat_cartas, 'nombre': 'Slay the Spire (Juego de Mesa)', 'precio': Decimal('350.00'), 'stock': 10},
        
        # Juegos de Rol (RPG) (10)
        {'categoria': cat_rol, 'nombre': 'D&D Player\'s Handbook', 'precio': Decimal('180.00'), 'stock': 30},
        {'categoria': cat_rol, 'nombre': 'D&D Monster Manual', 'precio': Decimal('180.00'), 'stock': 25},
        {'categoria': cat_rol, 'nombre': 'D&D Dungeon Master\'s Guide', 'precio': Decimal('180.00'), 'stock': 20},
        {'categoria': cat_rol, 'nombre': 'Pathfinder Core Rulebook', 'precio': Decimal('200.00'), 'stock': 15},
        {'categoria': cat_rol, 'nombre': 'Call of Cthulhu Starter Set', 'precio': Decimal('100.00'), 'stock': 20},
        {'categoria': cat_rol, 'nombre': 'Cyberpunk RED Core Rulebook', 'precio': Decimal('210.00'), 'stock': 10},
        {'categoria': cat_rol, 'nombre': 'Vampire: The Masquerade', 'precio': Decimal('190.00'), 'stock': 12},
        {'categoria': cat_rol, 'nombre': 'Starfinder Core Rulebook', 'precio': Decimal('200.00'), 'stock': 10},
        {'categoria': cat_rol, 'nombre': 'FATE Core System', 'precio': Decimal('90.00'), 'stock': 15},
        {'categoria': cat_rol, 'nombre': 'Blades in the Dark', 'precio': Decimal('160.00'), 'stock': 8},

        # Juegos de Fiesta (Party) (10)
        {'categoria': cat_fiesta, 'nombre': 'Codenames', 'precio': Decimal('80.00'), 'stock': 50},
        {'categoria': cat_fiesta, 'nombre': 'Cards Against Humanity', 'precio': Decimal('100.00'), 'stock': 40},
        {'categoria': cat_fiesta, 'nombre': 'What Do You Meme?', 'precio': Decimal('110.00'), 'stock': 35},
        {'categoria': cat_fiesta, 'nombre': 'Secret Hitler', 'precio': Decimal('130.00'), 'stock': 20},
        {'categoria': cat_fiesta, 'nombre': 'Telestrations', 'precio': Decimal('100.00'), 'stock': 25},
        {'categoria': cat_fiesta, 'nombre': 'Just One', 'precio': Decimal('90.00'), 'stock': 30},
        {'categoria': cat_fiesta, 'nombre': 'Werewolf', 'precio': Decimal('60.00'), 'stock': 40},
        {'categoria': cat_fiesta, 'nombre': 'The Quacks of Quedlinburg', 'precio': Decimal('210.00'), 'stock': 15},
        {'categoria': cat_fiesta, 'nombre': 'Wits & Wagers', 'precio': Decimal('120.00'), 'stock': 18},
        {'categoria': cat_fiesta, 'nombre': 'Taco Gato Cabra Queso Pizza', 'precio': Decimal('50.00'), 'stock': 60},
    ]

    # --- (Generamos slugs manualmente) ---
    print("\nCreando productos (esto puede tardar un momento)...")
    
    for data in productos_a_crear:
        Producto.objects.create(
            categoria=data['categoria'],
            nombre=data['nombre'],
            slug=slugify(data['nombre']), 
            descripcion=f"Descripción de {data['nombre']}.",
            precio=data['precio'],
            stock=data['stock']
        )
    
    print(f"¡Se crearon {len(productos_a_crear)} productos!")


# Esta función es para revertir la migración (borrar los datos)
def reverse_data(apps, schema_editor):
    Categoria = apps.get_model('store', 'Categoria')
    Producto = apps.get_model('store', 'Producto')

    # Borra todos los productos y categorías
    Producto.objects.all().delete()
    Categoria.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(populate_data, reverse_code=reverse_data),
    ]