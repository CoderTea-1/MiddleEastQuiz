let currentIndex = 0;
let score = 0;

// -----------------
// Locations Data
// -----------------
const LOCATIONS = [
  // Countries
  { name: "India", type: "country", countryName: "India" },
  { name: "Turkey", type: "country", countryName: "Turkey" },

  // Seas (polygon)
  { name: "Black Sea", type: "sea", geometry: {
      "type": "Polygon",
      "coordinates": [[[27, 40],[41, 40],[41, 46],[27, 46],[27,40]]]
  }},
  { name: "Persian Gulf", type: "sea", geometry: {
      "type": "Polygon",
      "coordinates": [[[48.5, 24],[56, 24],[56, 30],[48.5,30],[48.5,24]]]
  }},

  // Rivers (approx lat/lon)
  { name: "Nile", type: "river", lat: 26, lon: 31 },
  { name: "Amu Darya", type: "river", lat: 41, lon: 63 },

  // Cities
  { name: "Istanbul", type: "city", lat: 41, lon: 29 },
  { name: "Mecca", type: "city", lat: 21.4, lon: 39.8 },

  // Mountains
  { name: "Himalayas", type: "mountain", lat: 28, lon: 85 }
];

// -----------------
// Initialize Map
// -----------------
const map = L.map('map').setView([30, 40], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let countriesLayer;
fetch('countries.geo.json')
  .then(res => res.json())
  .then(geojson => {
    countriesLayer = L.geoJSON(geojson).addTo(map);
    showQuestion();
  });

// -----------------
// Show Question
// -----------------
function showQuestion() {
    if(currentIndex >= LOCATIONS.length){
        document.getElementById('question').innerText = "Quiz finished!";
        document.getElementById('score').innerText = `Your score: ${score} / ${LOCATIONS.length}`;
        return;
    }
    document.getElementById('question').innerHTML = `Find: <b>${LOCATIONS[currentIndex].name}</b>`;
}

// -----------------
// Country Check
// -----------------
function pointInCountry(latlng, countryName){
    let inside = false;
    countriesLayer.eachLayer(layer => {
        if(layer.feature.properties.name === countryName){
            if(turf.booleanPointInPolygon([latlng.lng, latlng.lat], layer.feature.geometry)){
                inside = true;
            }
        }
    });
    return inside;
}

// -----------------
// Click Detection
// -----------------
function isCorrectClick(loc, click){
    if(loc.type === "country"){
        return pointInCountry(click, loc.countryName);
    } else if(loc.type === "sea" || loc.type === "riverPoly"){
        return turf.booleanPointInPolygon([click.lng, click.lat], loc.geometry);
    } else {
        // Small rivers, cities, mountains
        let tolerance = 50000; // 50 km default
        if(loc.type === "river") tolerance = 150000;
        if(loc.type === "sea") tolerance = 300000;
        if(loc.type === "city") tolerance = 50000;
        if(loc.type === "mountain") tolerance = 50000;

        const distance = map.distance(click, [loc.lat, loc.lon]);
        return distance <= tolerance;
    }
}

// -----------------
// Handle Map Click
// -----------------
map.on('click', function(e){
    if(currentIndex >= LOCATIONS.length) return;

    const loc = LOCATIONS[currentIndex];
    const click = e.latlng;

    const correct = isCorrectClick(loc, click);

    if(correct){
        score++;
        alert("✅ Correct!");
    } else {
        alert(`❌ Wrong! Correct location: ${loc.name}`);
    }

    // Marker at actual location or center of polygon
    if(loc.type === "country" || loc.type === "sea" || loc.type === "riverPoly"){
        let center;
        if(loc.lat && loc.lon){
            center = [loc.lat, loc.lon];
        } else {
            center = turf.center(loc.geometry).geometry.coordinates.reverse();
        }
        L.marker(center).addTo(map);
    } else {
        L.marker([loc.lat, loc.lon]).addTo(map);
    }

    currentIndex++;
    showQuestion();
});
