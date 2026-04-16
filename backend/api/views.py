from rest_framework import generics, permissions

from .models import Game, Review
from .serializers import GameSerializer, ReviewSerializer


class GameListView(generics.ListAPIView):
    queryset = Game.objects.select_related('genre').all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]


class GameDetailView(generics.RetrieveAPIView):
    queryset = Game.objects.select_related('genre').all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(game_id=self.kwargs['game_pk']).select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, game_id=self.kwargs['game_pk'])


class ReviewDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(game_id=self.kwargs['game_pk'])
