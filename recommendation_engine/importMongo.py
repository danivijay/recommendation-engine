import pandas as pd
from pymongo import MongoClient

client = MongoClient(host=['localhost:27017'])
database = client['recommendation_system']
collection = database['movies']

def csv_to_json(filename, header=0):
    data = pd.read_csv(filename, header=header)
    return data.to_dict('records')

collection.insert_many(csv_to_json('https://raw.githubusercontent.com/danivijay/movie-recommendation-system/master/recommendation_engine/movie_dataset.csv'))