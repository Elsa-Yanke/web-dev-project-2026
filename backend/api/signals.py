from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Review
from .summarizer import generate_summary


def _regenerate_summary(game):
    steam_positive = list(game.steam_reviews.filter(is_positive=True).values_list('text', flat=True))
    steam_negative = list(game.steam_reviews.filter(is_positive=False).values_list('text', flat=True))
    user_positive = list(game.reviews.filter(is_positive=True).values_list('text', flat=True))
    user_negative = list(game.reviews.filter(is_positive=False).values_list('text', flat=True))
    positive = steam_positive + user_positive
    negative = steam_negative + user_negative

    game.ai_summary = generate_summary(positive, negative)
    game.save(update_fields=['ai_summary'])


@receiver(post_save, sender=Review)
def on_review_save(sender, instance, **kwargs):
    _regenerate_summary(instance.game)


@receiver(post_delete, sender=Review)
def on_review_delete(sender, instance, **kwargs):
    _regenerate_summary(instance.game)
