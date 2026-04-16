from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView

from .auth_views import register_view
from .views import GameListView, GameDetailView, ReviewListCreateView, ReviewDetailView

urlpatterns = [
    path('auth/register/', register_view, name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('auth/logout/', TokenBlacklistView.as_view(), name='auth-logout'),

    path('games/', GameListView.as_view(), name='game-list'),
    path('games/<int:pk>/', GameDetailView.as_view(), name='game-detail'),

    path('games/<int:game_pk>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('games/<int:game_pk>/reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]
