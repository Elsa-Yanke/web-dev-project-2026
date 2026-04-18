from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView

from .auth_views import register_view, me_view
from .views import (
    game_list, game_detail, genre_list,
    ReviewListCreateView, ReviewDetailView,
    LibraryListCreateView, LibraryDetailView,
)

urlpatterns = [
    path('auth/register/', register_view, name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('auth/logout/', TokenBlacklistView.as_view(), name='auth-logout'),
    path('auth/me/', me_view, name='auth-me'),

    path('games/', game_list, name='game-list'),
    path('games/<int:pk>/', game_detail, name='game-detail'),

    path('genres/', genre_list, name='genre-list'),

    path('games/<int:game_pk>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('games/<int:game_pk>/reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),

    path('library/', LibraryListCreateView.as_view(), name='library-list-create'),
    path('library/<int:pk>/', LibraryDetailView.as_view(), name='library-detail'),
]
