import pandas as pd
from bertopic import BERTopic
import string
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.stem.porter import PorterStemmer
import nltk
import re
from collections import Counter
from typing import List

def cluster_csv_comments(csv_file_path: str,
                         text_column: str = 'text',
                         language: str = 'english',
                         top_n_words: int = 10,
                         nr_topics: str = 'auto'):
    """
    מקבץ תגובות מקובץ CSV לנושאים לאחר עיבוד מוקדם.

    Args:
        csv_file_path: נתיב לקובץ ה-CSV.
        text_column: שם העמודה שמכילה את הטקסטים (ברירת מחדל: 'text').
        language: שפת הטקסטים (ברירת מחדל: 'english').
        top_n_words: מספר המילים המובילות להציג בכל נושא.
        nr_topics: מספר הנושאים ('auto' למספר אוטומטי).

    Returns:
        pd.DataFrame: DataFrame עם התגובות, הנושאים והמילים המובילות.
    """

    # 1. טעינת הנתונים
    df = pd.read_csv(csv_file_path)
    texts = df[text_column].astype(str).tolist()  # וודא שהטקסטים הם מחרוזות

    # 2. פרה-פרוססינג
    PUNCT_TO_REMOVE = string.punctuation
    STOPWORDS = set(stopwords.words(language))
    lemmatizer = WordNetLemmatizer()
    wordnet_map = {"N": wordnet.NOUN, "V": wordnet.VERB,
                   "J": wordnet.ADJ, "R": wordnet.ADV}
    stemmer = PorterStemmer()

    def clean_text(text: str) -> str:
        text = remove_punctuation(text)
        text = remove_stopwords(text)
        text = remove_emoji(text)
        text = lemmatize_words(text)
        text = stem_words(text)
        return text

    def remove_punctuation(text: str) -> str:
        return text.translate(str.maketrans('', '', PUNCT_TO_REMOVE))

    def remove_stopwords(text: str) -> str:
        return " ".join([word for word in str(text).split() if word not in STOPWORDS])

    def remove_emoji(text: str) -> str:
        emoji_pattern = re.compile(
            "["
            u"\U0001F600-\U0001F64F"  # emoticons
            u"\U0001F300-\U0001F5FF"  # symbols & pictographs
            u"\U0001F680-\U0001F6FF"  # transport & map symbols
            u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
            u"\U00002702-\U000027B0"
            u"\U000024C2-\U0001F251"
            "]+", flags=re.UNICODE)
        return emoji_pattern.sub(r'', text)

    def lemmatize_words(text: str) -> str:
        pos_tagged_text = nltk.pos_tag(text.split())
        return " ".join([lemmatizer.lemmatize(word, wordnet_map.get(pos[0], wordnet.NOUN)) for word, pos in pos_tagged_text])

    def stem_words(text: str) -> str:
        return " ".join([stemmer.stem(word) for word in text.split()])

    df['cleaned_text'] = df[text_column].apply(clean_text)

    # הסרת מילים נפוצות ונדירות (אופציונלי - ניתן להוסיף כפרמטר)
    cnt = Counter()
    for text in df["cleaned_text"].values:
        for word in text.split():
            cnt[word] += 1
    df['cleaned_text'] = df['cleaned_text'].apply(
        lambda x: remove_freqwords(x, cnt))
    df['cleaned_text'] = df['cleaned_text'].apply(
        lambda x: remove_rarewords(x, cnt))

    def remove_freqwords(text, cnt):
        FREQWORDS = set([w for (w, wc) in cnt.most_common(10)])
        return " ".join([word for word in str(text).split() if word not in FREQWORDS])

    def remove_rarewords(text, cnt):
        n_rare_words = 10
        RAREWORDS = set([w for (w, wc) in cnt.most_common()[:-
                                                           n_rare_words-1:-1]])
        return " ".join([word for word in str(text).split() if word not in RAREWORDS])

    # 3. יצירת המודל והתאמה
    topic_model = BERTopic(language=language, top_n_words=top_n_words,
                           nr_topics=nr_topics)
    topics, probs = topic_model.fit_transform(df['cleaned_text'].tolist())

    # 4. הכנת תוצאות
    topic_info = topic_model.get_topic_info()
    df_results = pd.DataFrame({'original_text': df[text_column],
                               'cleaned_text': df['cleaned_text'],
                               'topic': topics})

    def get_top_words(topic_id):
        return topic_model.get_topic(topic_id)

    df_results['top_words'] = df_results['topic'].apply(get_top_words)

    return df_results


# דוגמה לשימוש:
csv_file = 'your_comments.csv'  # החלף בנתיב לקובץ ה-CSV שלך
results_df = cluster_csv_comments(csv_file, text_column='comment_text',
                                  language='english', top_n_words=5,
                                  nr_topics='auto')
print(results_df.head())