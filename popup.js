document.addEventListener("DOMContentLoaded", () => {
  const locationEl = document.getElementById("location");
  const aqiEl = document.getElementById("aqi");

  // Step 1: Get current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      locationEl.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;

      // Step 2: Call OpenAQ API
      fetch(`https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000&limit=1`)
        .then(response => response.json())
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            const location = data.results[0].location;
            const parameter = data.results[0].measurements[0].parameter;
            const value = data.results[0].measurements[0].value;
            const unit = data.results[0].measurements[0].unit;

            aqiEl.textContent = `${parameter.toUpperCase()}: ${value} ${unit} at ${location}`;
          } else {
            aqiEl.textContent = "No air quality data found.";
          }
        })
        .catch(err => {
          console.error(err);
          aqiEl.textContent = "Error fetching air quality.";
        });
    },
    (error) => {
      console.error(error);
      locationEl.textContent = "Location access denied.";
      aqiEl.textContent = "Can't fetch air quality without location.";
    }
  );
});
