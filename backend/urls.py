# backend/urls.py
# Archivo completo para copiar y pegar

from django.contrib import admin
from django.urls import path, include


# Importa esto para las imágenes
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Creamos una URL base para toda nuestra API
    path('api/v1/', include('store.urls')), 
]

# Esto es lo que permite que el navegador vea las imágenes
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)