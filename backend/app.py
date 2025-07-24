from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['native_foods']
collection = db['foods']  # ✅ FIXED: use 'foods' instead of 'city_data'

@app.route('/get_foods', methods=['POST'])
def get_foods():
    data = request.get_json()
    city = data.get('city', '').lower()
    food_type = data.get('type', '').lower()

    city_doc = collection.find_one({"city": city})

    if not city_doc:
        return jsonify({"error": "City not found"}), 404

    items = city_doc.get("items", [])

    if food_type in ['veg', 'non-veg', 'sweets', 'drinks']:
        items = [item for item in items if item['type'].lower() == food_type]

    return jsonify({"foods": items})

if __name__ == '__main__':
    app.run(debug=True)
