
import os
from urllib.parse import quote_plus

import requests
from django.conf import settings
from django.core.management.base import BaseCommand

from store.models import Producto


# Lista de productos (slug, nombre) – los 50 que ya tienes
PRODUCTOS = [
    ("catan", "Catan"),
    ("risk", "Risk"),
    ("carcassonne", "Carcassonne"),
    ("terraforming-mars", "Terraforming Mars"),
    ("gloomhaven", "Gloomhaven"),
    ("scythe", "Scythe"),
    ("7-wonders", "7 Wonders"),
    ("azul", "Azul"),
    ("wingspan", "Wingspan"),
    ("root", "Root"),
    ("ticket-to-ride", "Ticket to Ride"),
    ("dixit", "Dixit"),
    ("monopoly", "Monopoly"),
    ("clue", "Clue"),
    ("jenga", "Jenga"),
    ("uno", "Uno"),
    ("scrabble", "Scrabble"),
    ("sequence", "Sequence"),
    ("king-of-tokyo", "King of Tokyo"),
    ("dobble", "Dobble"),
    ("magic-the-gathering-booster", "Magic: The Gathering"),
    ("pokemon-tcg-booster", "Pokemon TCG"),
    ("yu-gi-oh-booster", "Yu-Gi-Oh!"),
    ("exploding-kittens", "Exploding Kittens"),
    ("unstable-unicorns", "Unstable Unicorns"),
    ("the-mind", "The Mind"),
    ("sushi-go-party", "Sushi Go Party!"),
    ("coup", "Coup"),
    ("love-letter", "Love Letter"),
    ("slay-the-spire-juego-de-mesa", "Slay the Spire"),
    ("dd-players-handbook", "D&D Player's Handbook"),
    ("dd-monster-manual", "D&D Monster Manual"),
    ("dd-dungeon-masters-guide", "D&D Dungeon Master's Guide"),
    ("pathfinder-core-rulebook", "Pathfinder Core Rulebook"),
    ("call-of-cthulhu-starter-set", "Call of Cthulhu Starter Set"),
    ("cyberpunk-red-core-rulebook", "Cyberpunk RED"),
    ("vampire-the-masquerade", "Vampire: The Masquerade"),
    ("starfinder-core-rulebook", "Starfinder Core Rulebook"),
    ("fate-core-system", "FATE Core System"),
    ("blades-in-the-dark", "Blades in the Dark"),
    ("codenames", "Codenames"),
    ("cards-against-humanity", "Cards Against Humanity"),
    ("what-do-you-meme", "What Do You Meme?"),
    ("secret-hitler", "Secret Hitler"),
    ("telestrations", "Telestrations"),
    ("just-one", "Just One"),
    ("werewolf", "Werewolf"),
    ("the-quacks-of-quedlinburg", "The Quacks of Quedlinburg"),
    ("wits-wagers", "Wits & Wagers"),
    ("taco-gato-cabra-queso-pizza", "Taco Gato Cabra Queso Pizza"),
]


class Command(BaseCommand):
    help = "Descarga imágenes dummy y las asigna a los 50 productos."

    def handle(self, *args, **options):
        media_root = settings.MEDIA_ROOT
        productos_dir = os.path.join(media_root, "productos")
        os.makedirs(productos_dir, exist_ok=True)

        self.stdout.write(self.style.WARNING(f"MEDIA_ROOT: {media_root}"))
        self.stdout.write(self.style.WARNING(f"Guardando imágenes en: {productos_dir}\n"))

        for slug, nombre in PRODUCTOS:
            try:
                producto = Producto.objects.get(slug=slug)
            except Producto.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"[X] Producto '{slug}' no existe. Se omite."))
                continue

            texto = quote_plus(nombre)
            image_url = f"https://via.placeholder.com/600x600.png?text={texto}"

            self.stdout.write(f"Descargando imagen para {nombre} ({slug})...")

            # Descargar imagen
            try:
                resp = requests.get(image_url, timeout=15)
                resp.raise_for_status()
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Error al descargar imagen: {e}"))
                continue

            # Guardar archivo en MEDIA_ROOT/productos/slug.jpg
            filename = f"{slug}.jpg"
            relative_path = os.path.join("productos", filename)
            full_path = os.path.join(media_root, relative_path)

            try:
                with open(full_path, "wb") as f:
                    f.write(resp.content)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Error al guardar archivo: {e}"))
                continue

            # Asignar al modelo y guardar
            producto.imagen = relative_path
            producto.save()

            self.stdout.write(self.style.SUCCESS(f"  OK -> {relative_path}"))

        self.stdout.write(self.style.SUCCESS("\n✔ Proceso completado.\n"))