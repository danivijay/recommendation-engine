import pandas as pd
from pymongo import MongoClient

client = MongoClient(host=['localhost:27017'])
database = client['recommendation_system']
collection = database['movies']

print("hello")

def csv_to_json(filename, header=0):
    data = pd.read_csv(filename, header=header)
    return data.to_dict('records')

collection.insert_many(csv_to_json('movie_dataset.csv'))