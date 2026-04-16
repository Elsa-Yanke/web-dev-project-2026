from django.contrib import admin
from .models import Game, Genre, Review, SteamReview, UserGame

admin.site.register(Genre)
admin.site.register(Game)
admin.site.register(Review)
admin.site.register(SteamReview)
admin.site.register(UserGame)
