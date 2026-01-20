let currentIndex = 0;
let score = 0;

// -----------------
// Locations Data
// -----------------
const LOCATIONS = [
  // Countries
  { name: "Afghanistan", type: "country", countryName: "Afghanistan" },
  { name: "Albania", type: "country", countryName: "Albania" },
  { name: "Armenia", type: "country", countryName: "Armenia" },
  { name: "Azerbaijan", type: "country", countryName: "Azerbaijan" },
  { name: "Bahrain", type: "country", countryName: "Bahrain" },
  { name: "Bulgaria", type: "country", countryName: "Bulgaria" },
  { name: "China", type: "country", countryName: "China" },
  { name: "Cyprus", type: "country", countryName: "Cyprus" },
  { name: "Djibouti", type: "country", countryName: "Djibouti" },
  { name: "Egypt", type: "country", countryName: "Egypt" },
  { name: "Eritrea", type: "country", countryName: "Eritrea" },
  { name: "Ethiopia", type: "country", countryName: "Ethiopia" },
  { name: "Georgia", type: "country", countryName: "Georgia" },
  { name: "Greece", type: "country", countryName: "Greece" },
  { name: "India", type: "country", countryName: "India" },
  { name: "Iran", type: "country", countryName: "Iran" },
  { name: "Iraq", type: "country", countryName: "Iraq" },
  { name: "Israel", type: "country", countryName: "Israel" },
  { name: "Jordan", type: "country", countryName: "Jordan" },
  { name: "Kazakhstan", type: "country", countryName: "Kazakhstan" },
  { name: "Kirgizstan", type: "country", countryName: "Kyrgyzstan" },
  { name: "Kuwait", type: "country", countryName: "Kuwait" },
  { name: "Lebanon", type: "country", countryName: "Lebanon" },
  { name: "Libya", type: "country", countryName: "Libya" },
  { name: "Macedonia", type: "country", countryName: "North Macedonia" },
  { name: "Oman", type: "country", countryName: "Oman" },
  { name: "Pakistan", type: "country", countryName: "Pakistan" },
  { name: "Qatar", type: "country", countryName: "Qatar" },
  { name: "Romania", type: "country", countryName: "Romania" },
  { name: "Russia", type: "country", countryName: "Russia" },
  { name: "Saudi Arabia", type: "country", countryName: "Saudi Arabia" },
  { name: "Serbia", type: "country", countryName: "Serbia" },
  { name: "Somalia", type: "country", countryName: "Somalia" },
  { name: "Sudan", type: "country", countryName: "Sudan" },
  { name: "Syria", type: "country", countryName: "Syria" },
  { name: "Tajikistan", type: "country", countryName: "Tajikistan" },
  { name: "Turkey", type: "country", countryName: "Turkey" },
  { name: "Turkmenistan", type: "country", countryName: "Turkmenistan" },
  { name: "Ukraine", type: "country", countryName: "Ukraine" },
  { name: "United Arab Emirates", type: "country", countryName: "United Arab Emirates" },
  { name: "Uzbekistan", type: "country", countryName: "Uzbekistan" },
  { name: "Yemen", type: "country", countryName: "Yemen" },

  // Seas (polygon examples)
  { name: "Black Sea", type: "sea", geometry: { "type": "Polygon", "coordinates":[[[27,40],[41,40],[41,46],[27,46],[27,40]]] } },
  { name: "Caspian Sea", type: "sea", geometry: { "type": "Polygon", "coordinates":[[[47,36],[54,36],[54,47],[47,47],[47,36]]] } },
  { name: "Mediterranean Sea", type: "sea", geometry: { "type": "Polygon", "coordinates":[[[-6,30],[36,30],[36,46],[-6,46],[-6,30]]] } },
  { name: "Indian Ocean", type: "sea", geometry: { "type": "Polygon", "coordinates":[[[20,-40],[120,-40],[120,30],[20,30],[20,-40]]] } },
  { name: "Red Sea", type: "sea", geometry: { "type": "Polygon", "coordinates":[[[32,12],[43,12],[43,30],[32,30],[32,12]]] } },
  { name: "Persian Gulf", type: "sea", geometry: { "type": "Polygon", "coordinates":[[[48.5,24],[56,24],[56,30],[48.5,30],[48.5,24]]] } },

  // Rivers (approximate lat/lon)
  { name: "Amu Darya", type: "river", lat: 41, lon: 63 },
  { name: "Syr Darya", type: "river", lat: 41, lon: 67 },
  { name: "Indus", type: "river", lat: 28, lon: 70 },
  { name: "Euphrates", type: "river", lat: 33, lon: 43 },
  { name: "Tigris", type: "river", lat: 33, lon: 44 },
  { name: "Nile", type: "river", lat: 26, lon: 31 },

  // Cities
  { name: "Aden", type: "city", lat: 12.8, lon: 45 },
  { name: "Herat", type: "city", lat: 34.3, lon: 62 },
  { name: "Istanbul", type: "city", lat: 41, lon: 29 },
  { name: "Mecca", type: "city", lat: 21.4, lon: 39.8 },
  { name: "Medina", type: "city", lat: 24.5, lon: 39.6 },

  // Mountains
  { name: "Himalayas", type: "mountain", lat: 28, lon: 85 },
  { name: "Hindu Kush", type: "mountain", lat: 35, lon: 69 },
  { name: "Tien Shan", type: "mountain", lat: 42, lon: 83 },

  // Strait / Canal locations
  { name: "Suez Canal", type: "city", lat: 30.6, lon: 32.3 },
  { name: "Bab el-Mandeb", type: "city", lat: 12.6, lon: 43.3 },
  { name: "Hormuz", type: "city", lat: 26.6, lon: 56.3 },
  { name: "Bosphorus", type: "city", lat: 41.1, lon: 29.0 },
  { name: "Dardanelles", type: "city", lat: 40.1, lon: 26.4 }
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

    // Non-blocking feedback
    const feedbackDiv = document.getElementById('score');
    if(correct){
        score++;
        feedbackDiv.innerText = `✅ Correct! Score: ${score} / ${LOCATIONS.length}`;
    } else {
        feedbackDiv.innerText = `❌ Wrong! Correct location: ${loc.name}. Score: ${score} / ${LOCATIONS.length}`;
    }

    // Place marker at actual location or polygon center
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

    // Move to next question
    currentIndex++;
    showQuestion();
});
