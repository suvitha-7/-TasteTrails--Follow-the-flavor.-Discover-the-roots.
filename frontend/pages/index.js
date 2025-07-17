import React, { useState } from "react";

export default function Home() {
  const [location, setLocation] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedFood, setSelectedFood] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const getSuggestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });
      const data = await response.json();
      if (data.foods) {
        setFoodItems(data.foods);
        getUserLocation(); // fetch location when showing results
      } else {
        setFoodItems([]);
      }
      setSelectedFood(null);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location access denied or unavailable.", error);
        setUserLocation(null);
      }
    );
  };

  const filteredItems =
    filter === "ALL"
      ? foodItems
      : foodItems.filter((item) => item.type.toUpperCase() === filter);

  const getDirectionsUrl = (lat, lng) => {
    if (!userLocation) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-lime-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          🍽️ Native Food Recommender
        </h1>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a location (e.g., delhi)"
          className="w-full p-3 border border-blue-300 rounded-lg"
        />
        <div className="flex justify-center gap-4">
          {["ALL", "VEG", "NON-VEG"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg border border-blue-500 ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={getSuggestions}
          className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          Get Food Suggestions
        </button>

        <div className="space-y-4">
          {filteredItems.map((food, index) => (
            <div
              key={index}
              className="bg-gray-900 text-white rounded-lg p-4 cursor-pointer"
              onClick={() =>
                setSelectedFood(selectedFood === food.name ? null : food.name)
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  🍜 <strong>{food.name}</strong> — ⭐ {food.rating}{" "}
                  <span className="text-sm">({food.type})</span>
                </div>
                <div>⭐</div>
              </div>

              {selectedFood === food.name && (
                <div className="mt-3 text-sm">
                  <h3 className="text-lg font-semibold text-pink-500">
                    📍 Places to try {food.name}:
                  </h3>
                  {food.places.map((place, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 p-2 rounded mt-2 text-black"
                    >
                      <p className="font-medium text-sm">📍 {place.name}</p>
                      {place.coordinates ? (
                        <a
                          href={getDirectionsUrl(
                            place.coordinates.lat,
                            place.coordinates.lng
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          View on Google Maps →
                        </a>
                      ) : (
                        <p className="text-gray-500">Location not available</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
