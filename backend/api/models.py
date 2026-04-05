from django.db import models

class Genre(models.Model):
    name = models.TextField(max_length = 100)


class Game(models.Model):
    title = models.CharField(max_length = 255)
    description = models.TextField()
    release_year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places = 2)
    genre = models.ForeignKey(Genre, on_delete=models.PROTECT, related_name='games')

    def __str__(self):
        return self.title
    

class Review(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.game.title}"
    
