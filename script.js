let currentIndex = 0;
let score = 0;

// Example: full list should include all rivers, seas, mountains, cities, countries
const LOCATIONS = [
  {name:"Amu Darya", lat:41, lon:63, country:"Afghanistan"},
  {name:"Syr Darya", lat:44, lon:67, country:"Kazakhstan"},
  {name:"Indus", lat:30, lon:70, country:"Pakistan"},
  {name:"Euphrates", lat:34, lon:40, country:"Iraq"},
  {name:"Tigris", lat:35, lon:44, country:"Iraq"},
  {name:"Nile", lat:26, lon:31, country:"Egypt"},
  {name:"Black Sea", lat:43, lon:35, country:"Turkey"},
  {name:"Mediterranean Sea", lat:34, lon:18, country:"Egypt"},
  {name:"India", lat:22, lon:79, country:"India"},
  {name:"Turkey", lat:39, lon:35, country:"Turkey"}
  // Add all your remaining locations here...
];

const map = L.map('map').setView([30, 40], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load country polygons
let countriesLayer;
fetch('countries.geo.json')
  .then(res => res.json())
  .then(geojson => {
    countriesLayer = L.geoJSON(geojson).addTo(map);
    showQuestion();
  });

// Draw question
function showQuestion() {
    if(currentIndex >= LOCATIONS.length){
        document.getElementById('question').innerText = "Quiz finished!";
        document.getElementById('score').innerText = `Your score: ${score} / ${LOCATIONS.length}`;
        return;
    }
    document.getElementById('question').innerHTML = `Find: <b>${LOCATIONS[currentIndex].name}</b>`;
}

// Check if click is inside country polygon
function pointInCountry(latlng, countryName){
    let inside = false;
    countriesLayer.eachLayer(layer => {
        if(layer.feature.properties.name === countryName){
            if(turf.booleanPointInPolygon([latlng.lng, latlng.lat], layer.feature)){
                inside = true;
            }
        }
    });
    return inside;
}

// Handle clicks
map.on('click', function(e){
    if(currentIndex >= LOCATIONS.length) return;

    const loc = LOCATIONS[currentIndex];
    const distance = map.distance(e.latlng, [loc.lat, loc.lon]);
    const tolerance = 50000; // 50 km for rivers/cities

    let correct = false;
    if(pointInCountry(e.latlng, loc.country)) correct = true;
    if(distance < tolerance) correct = true;

    if(correct){
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! Correct location: ${loc.name}`);
    }

    // Mark correct location
    L.marker([loc.lat, loc.lon]).addTo(map);

    currentIndex++;
    showQuestion();
});
