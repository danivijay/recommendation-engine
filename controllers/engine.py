import pandas as pd
import numpy as np
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import argparse

client = MongoClient('mongodb://localhost/')
db=client.recommendation_system
serverStatusResult=db.command("serverStatus")

parser = argparse.ArgumentParser(description='Example with non-optional arguments')
parser.add_argument('items', action="store")
args = vars(parser.parse_args())
# print(args['items'])
movie_user_likes = args['items'].split("|")
# print('movie_user_likes', movie_user_likes)

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

# movie_user_likes = ["Avatar", "Aliens"]

list_arr = []
for movie in movie_user_likes:
    movie_index = get_index_from_title(movie)
    result = list(map(lambda x: x[1], list(enumerate(cosine_similarity[movie_index]))))
    list_arr.append(result)

final_values = [sum(x) for x in zip(*list_arr)]

divide_factor = len(movie_user_likes)
res_list = []
for i, value in enumerate(final_values):
    res_list.append((df['title'][i], value/divide_factor))  

sorted_similar_movies = sorted(res_list, key = lambda x: x[1], reverse = True)

result = []

i = 0
for movie in sorted_similar_movies:
    title = movie[0]
    if title not in movie_user_likes:
        result.append(title)
        i = i + 1
    if i > 4:
        break

print("|".join(result))
