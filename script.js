let currentIndex = 0;
let score = 0;

// 80+ locations (subset shown; add all your locations here)
const LOCATIONS = [
  {name:"Amu Darya", lat:41, lon:63, country:"Afghanistan", type:"river"},
  {name:"Syr Darya", lat:44, lon:67, country:"Kazakhstan", type:"river"},
  {name:"Indus", lat:30, lon:70, country:"Pakistan", type:"river"},
  {name:"Euphrates", lat:34, lon:40, country:"Iraq", type:"river"},
  {name:"Tigris", lat:35, lon:44, country:"Iraq", type:"river"},
  {name:"Nile", lat:26, lon:31, country:"Egypt", type:"river"},
  {name:"Aral Sea", lat:45, lon:61, country:"Kazakhstan", type:"sea"},
  {name:"Black Sea", lat:43, lon:35, country:"Turkey", type:"sea"},
  {name:"Caspian Sea", lat:41, lon:50, country:"Kazakhstan", type:"sea"},
  {name:"Indian Ocean", lat:-20, lon:80, country:"India", type:"sea"},
  {name:"Mediterranean Sea", lat:34, lon:18, country:"Egypt", type:"sea"},
  {name:"Persian Gulf", lat:25, lon:50, country:"Saudi Arabia", type:"sea"},
  {name:"Red Sea", lat:20, lon:38, country:"Egypt", type:"sea"},
  {name:"Bosphorus", lat:41, lon:29, country:"Turkey", type:"sea"},
  {name:"Dardanelles", lat:40, lon:26, country:"Turkey", type:"sea"},
  {name:"Suez Canal", lat:30, lon:32, country:"Egypt", type:"river"},
  {name:"Bab el-Mandeb", lat:12, lon:43, country:"Yemen", type:"sea"},
  {name:"Hormuz", lat:27, lon:56, country:"Iran", type:"sea"},
  {name:"Afghanistan", lat:33, lon:65, country:"Afghanistan", type:"country"},
  {name:"India", lat:22, lon:79, country:"India", type:"country"},
  {name:"Turkey", lat:39, lon:35, country:"Turkey", type:"country"}
  // Continue adding all your locations here...
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
    const click = e.latlng;

    // Set tolerance radius
    let tolerance = 50000; // default 50 km
    if(loc.type === "sea") tolerance = 200000; // seas are large
    if(loc.type === "river") tolerance = 100000; // rivers ~100 km

    let correct = false;

    if(loc.type === "country") {
        if(pointInCountry(click, loc.country)) correct = true;
    } else {
        const distance = map.distance(click, [loc.lat, loc.lon]);
        if(distance < tolerance) correct = true;
    }

    if(correct){
        score++;
        alert("✅ Correct!");
    } else {
        alert(`❌ Wrong! Correct location: ${loc.name}`);
    }

    // Place marker on actual location
    L.marker([loc.lat, loc.lon]).addTo(map);

    currentIndex++;
    showQuestion();
});
