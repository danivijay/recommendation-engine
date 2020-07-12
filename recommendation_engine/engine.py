import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient

client = MongoClient('mongodb://localhost/')
db=client.recommendation_system
serverStatusResult=db.command("serverStatus")

print(db.movies.find())

def get_title_from_index(index):
	return df[df.index == index]["title"].values[0]

def get_index_from_title(title):
	return df[df.title == title]["index"].values[0]

#df = pd.read_csv("https://raw.githubusercontent.com/danivijay/movie-recommendation-system/master/recommendation_engine/movie_dataset.csv")
# print(df.columns)
df = pd.DataFrame(list(db.movies.find()))

features = ['keywords', 'cast', 'genres', 'director']

def combine_features(row):
    return f"{row['keywords']} {row['cast']} {row['genres']} {row['director']}"

df['combined_features'] = df.apply(combine_features, axis=1)
# print(df['combined_features'].head())

cv = CountVectorizer()
count_matrix = cv.fit_transform(df['combined_features'])
cosine_similarity = cosine_similarity(count_matrix)

movie_user_likes = "Avatar"
movie_index = get_index_from_title(movie_user_likes)

similar_movies = list(enumerate(cosine_similarity[movie_index]))
sorted_similar_movies = sorted(similar_movies, key = lambda x: x[1], reverse = True)

for i, movie in enumerate(sorted_similar_movies):
    print(get_title_from_index(movie[0]))
    if i > 50:
        break