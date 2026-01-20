let currentIndex = 0;
let score = 0;

// All locations from your original list with type and coordinates
// type: "country", "river", "sea", "city", "mountain"
// For rivers/cities/seas, click within radius counts as correct
const LOCATIONS = [
  {name:"Amu Darya", lat:41, lon:63, type:"river", country:"Afghanistan"},
  {name:"Syr Darya", lat:44, lon:67, type:"river", country:"Kazakhstan"},
  {name:"Indus", lat:30, lon:70, type:"river", country:"Pakistan"},
  {name:"Euphrates", lat:34, lon:40, type:"river", country:"Iraq"},
  {name:"Tigris", lat:35, lon:44, type:"river", country:"Iraq"},
  {name:"Nile", lat:26, lon:31, type:"river", country:"Egypt"},
  {name:"Aral Sea", lat:45, lon:61, type:"sea", country:"Kazakhstan"},
  {name:"Black Sea", lat:43, lon:35, type:"sea", country:"Turkey"},
  {name:"Caspian Sea", lat:41, lon:50, type:"sea", country:"Kazakhstan"},
  {name:"Indian Ocean", lat:-20, lon:80, type:"sea", country:"India"},
  {name:"Mediterranean Sea", lat:34, lon:18, type:"sea", country:"Egypt"},
  {name:"Persian Gulf", lat:25, lon:50, type:"sea", country:"Saudi Arabia"},
  {name:"Red Sea", lat:20, lon:38, type:"sea", country:"Egypt"},
  {name:"Bosphorus", lat:41, lon:29, type:"sea", country:"Turkey"},
  {name:"Dardanelles", lat:40, lon:26, type:"sea", country:"Turkey"},
  {name:"Suez Canal", lat:30, lon:32, type:"river", country:"Egypt"},
  {name:"Bab el-Mandeb", lat:12, lon:43, type:"sea", country:"Yemen"},
  {name:"Hormuz", lat:27, lon:56, type:"sea", country:"Iran"},
  {name:"Afghanistan", lat:33, lon:65, type:"country"},
  {name:"India", lat:22, lon:79, type:"country"},
  {name:"Turkey", lat:39, lon:35, type:"country"},
  {name:"Bahrain", lat:26, lon:50, type:"country"},
  {name:"China", lat:35, lon:103, type:"country"},
  {name:"Egypt", lat:26, lon:30, type:"country"},
  {name:"Pakistan", lat:30, lon:70, type:"country"},
  {name:"Istanbul", lat:41, lon:29, type:"city", country:"Turkey"},
  {name:"Mecca", lat:21.4, lon:39.8, type:"city", country:"Saudi Arabia"},
  {name:"Medina", lat:24.5, lon:39.6, type:"city", country:"Saudi Arabia"}
  // Add all remaining locations here...
];

const map = L.map('map').setView([30, 40], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let countriesLayer;
fetch('countries.geo.json')
  .then(res => res.json())
  .then(geojson => {
    countriesLayer = L.geoJSON(geojson).addTo(map);
    showQuestion();
  });

function showQuestion() {
    if(currentIndex >= LOCATIONS.length){
        document.getElementById('question').innerText = "Quiz finished!";
        document.getElementById('score').innerText = `Your score: ${score} / ${LOCATIONS.length}`;
        return;
    }
    document.getElementById('question').innerHTML = `Find: <b>${LOCATIONS[currentIndex].name}</b>`;
}

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

// Main click handler
map.on('click', function(e){
    if(currentIndex >= LOCATIONS.length) return;

    const loc = LOCATIONS[currentIndex];
    const click = e.latlng;

    // Determine tolerance based on type
    let tolerance = 50000; // default 50 km
    if(loc.type === "sea") tolerance = 250000;
    if(loc.type === "river") tolerance = 100000;
    if(loc.type === "city") tolerance = 50000;
    if(loc.type === "mountain") tolerance = 50000;

    let correct = false;
    if(loc.type === "country") {
        correct = pointInCountry(click, loc.name);
    } else {
        const distance = map.distance(click, [loc.lat, loc.lon]);
        correct = distance <= tolerance;
    }

    if(correct){
        score++;
        alert("✅ Correct!");
    } else {
        alert(`❌ Wrong! Correct location: ${loc.name}`);
    }

    // Mark the correct location
    L.marker([loc.lat, loc.lon]).addTo(map);

    currentIndex++;
    showQuestion();
});
