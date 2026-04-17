from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Game, Review, UserGame
from .serializers import GameSerializer, ReviewSerializer, UserGameSerializer

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def game_list(request):
    if request.method == 'GET':
        games = Game.objects.select_related('genre').all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def game_detail(request, pk):
    game = get_object_or_404(Game, pk=pk)

    if request.method == 'GET':
        return Response(GameSerializer(game).data)

    elif request.method == 'PUT':
        serializer = GameSerializer(game, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        game.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, game_pk):
        reviews = Review.objects.filter(game_id=game_pk).select_related('user')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, game_pk):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, game_id=game_pk)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_object(self, game_pk, pk):
        return get_object_or_404(Review, pk=pk, game_id=game_pk)

    def get(self, request, game_pk, pk):
        review = self.get_object(game_pk, pk)
        return Response(ReviewSerializer(review).data)

    def delete(self, request, game_pk, pk):
        review = self.get_object(game_pk, pk)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)