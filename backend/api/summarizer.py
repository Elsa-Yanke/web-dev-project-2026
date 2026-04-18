from sklearn.feature_extraction.text import TfidfVectorizer

# Generic words that appear in almost every game review and carry no meaning
GAMING_STOP_WORDS = {
    'game', 'games', 'play', 'playing', 'played', 'player', 'players',
    'just', 'like', 'good', 'great', 'fun', 'really', 'make', 'makes',
    'time', 'best', 'bad', 'bit', 'lot', 'way', 'thing', 'things',
    'want', 'know', 'think', 'feel', 'say', 'said', 'got', 'get',
    'don', 'doesnt', 'didnt', 'isnt', 'cant', 'wont', 'dont',
    'll', 've', 're', 'ive', 'im', 'id', 'irl',
    '10', 'hours', 'hour', 'new', 'old', 'better', 'worse',
    'little', 'pretty', 'actually', 'still', 'even', 'ever', 'never',
    'buy', 'bought', 'refund', 'recommend', 'worth', 'price',
    'op', 'ok', 'lol', 'yes', 'no',
}


def generate_summary(positive: list, negative: list) -> str:
    def top_phrases(texts, n=5):
        if len(texts) < 5:
            return []

        from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
        combined_stop_words = list(ENGLISH_STOP_WORDS.union(GAMING_STOP_WORDS))

        vec = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words=combined_stop_words,
            max_features=50,
            min_df=2,
            sublinear_tf=True,
            token_pattern=r'\b[a-zA-Z]{3,}\b',
        )
        tfidf_matrix = vec.fit_transform(texts)
        scores = zip(vec.get_feature_names_out(), tfidf_matrix.sum(axis=0).tolist()[0])
        top = sorted(scores, key=lambda x: -x[1])[:n]
        return [phrase for phrase, _ in top]

    pros = top_phrases(positive)
    cons = top_phrases(negative)

    if pros and cons:
        return (
            f"Players love the {', '.join(pros[:3])}. "
            f"Highly appreciated: {', '.join(pros[3:])}. "
            f"Some players mention issues with {', '.join(cons[:3])}."
        )
    elif pros:
        return (
            f"Players love the {', '.join(pros[:3])}. "
            f"Highlights include {', '.join(pros[3:])}."
        )
    elif cons:
        return f"Players commonly mention issues with {', '.join(cons)}."
    return ''
