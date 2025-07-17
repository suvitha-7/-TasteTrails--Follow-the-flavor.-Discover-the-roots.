from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample data for multiple cities
food_data = {
    "delhi": [
        {
            "name": "Chole Bhature",
            "type": "veg",
            "rating": 4.7,
            "places": [
                {
                    "name": "Sita Ram Diwan Chand",
                    "coordinates": {"lat": 28.6407, "lng": 77.2196}
                },
                {
                    "name": "Om Corner",
                    "coordinates": {"lat": 28.6516, "lng": 77.2242}
                }
            ]
        },
        {
            "name": "Butter Chicken",
            "type": "non-veg",
            "rating": 4.6,
            "places": [
                {
                    "name": "Moti Mahal",
                    "coordinates": {"lat": 28.6353, "lng": 77.2200}
                }
            ]
        },
        {
            "name": "Rajma Chawal",
            "type": "veg",
            "rating": 4.5,
            "places": [
                {
                    "name": "Shankar Market",
                    "coordinates": {"lat": 28.6312, "lng": 77.2175}
                }
            ]
        }
    ]
}

@app.route('/get_foods', methods=['POST'])
def get_foods():
    data = request.get_json()
    location = data.get('location', '').lower()
    foods = food_data.get(location, [])
    return jsonify({"foods": foods})

if __name__ == '__main__':
    app.run(debug=True)
