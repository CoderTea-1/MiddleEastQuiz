let currentIndex = 0;
let score = 0;
let countriesLayer;

// Example location (add all 80+)
const LOCATIONS = [
  { name: "Egypt", type: "country", countryName: "Egypt" },
  { name: "Black Sea", type: "sea", geometry: {"type":"Polygon","coordinates":[[[27,40],[41,40],[41,46],[27,46],[27,40]]]}},
  { name: "Nile", type: "river", lat:26, lon:31 }
];

// ---------------------------
// Initialize map
// ---------------------------
const map = L.map('map').setView([30,40],3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ---------------------------
// Load countries
// ---------------------------
fetch('countries.geo.json')
  .then(res => res.json())
  .then(geojson => {
    countriesLayer = L.geoJSON(geojson).addTo(map);
    showQuestion();
  });

// ---------------------------
// Show Question
// ---------------------------
function showQuestion(){
  if(currentIndex >= LOCATIONS.length){
    document.getElementById('question').innerText = "🏆 Quiz finished!";
    document.getElementById('score').innerText = `Final score: ${score} / ${LOCATIONS.length}`;
    return;
  }
  document.getElementById('question').innerHTML = `Find: <b>${LOCATIONS[currentIndex].name}</b>`;
}

// ---------------------------
// Check clicks
// ---------------------------
function pointInCountry(latlng, countryName){
  let inside = false;
  countriesLayer.eachLayer(layer=>{
    if(layer.feature.properties.name === countryName){
      if(turf.booleanPointInPolygon([latlng.lng, latlng.lat], layer.feature.geometry)){
        inside = true;
      }
    }
  });
  return inside;
}

function isCorrectClick(loc, click){
  if(loc.type==="country") return pointInCountry(click, loc.countryName);
  if(loc.type==="sea") return turf.booleanPointInPolygon([click.lng, click.lat], loc.geometry);
  // rivers, cities, mountains: use radius
  let tolerance=50000;
  if(loc.type==="river") tolerance=150000;
  if(loc.type==="city") tolerance=50000;
  if(loc.type==="mountain") tolerance=50000;
  return map.distance(click,[loc.lat,loc.lon])<=tolerance;
}

// ---------------------------
// Map click
// ---------------------------
map.on('click', function(e){
  if(currentIndex>=LOCATIONS.length) return;
  if(!countriesLayer) return;

  const loc = LOCATIONS[currentIndex];
  const click = e.latlng;
  const correct = isCorrectClick(loc,click);

  if(correct) score++;

  const feedbackDiv = document.getElementById('score');
  feedbackDiv.innerText = correct
    ? `✅ Correct! Score: ${score} / ${LOCATIONS.length}`
    : `❌ Wrong! Correct location: ${loc.name}. Score: ${score} / ${LOCATIONS.length}`;

  // Add marker at actual location
  let center;
  if(loc.type==="country"||loc.type==="sea"){
    center = loc.lat&&loc.lon?[loc.lat,loc.lon]:turf.center(loc.geometry).geometry.coordinates.reverse();
  } else {
    center = [loc.lat, loc.lon];
  }
  L.marker(center).addTo(map);

  // Force DOM update before moving to next question
  setTimeout(()=>{
    currentIndex++;
    showQuestion();
  }, 200); // short delay lets the score div update visually
});
