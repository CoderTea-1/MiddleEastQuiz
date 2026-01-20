let currentIndex = 0;
let score = 0;
let countriesLayer;
let seasLayer;

// Full location list (simplified here, include all your previous entries)
const LOCATIONS = [
  // Rivers
  {name:"Amu Darya", type:"river", countries:["Afghanistan","Uzbekistan"], lat:41, lon:63},
  {name:"Syr Darya", type:"river", countries:["Kazakhstan","Uzbekistan"], lat:44, lon:67},
  {name:"Indus", type:"river", countries:["Pakistan","India"], lat:30, lon:70},
  {name:"Euphrates", type:"river", countries:["Iraq","Syria"], lat:34, lon:40},
  {name:"Tigris", type:"river", countries:["Iraq"], lat:35, lon:44},
  {name:"Nile", type:"river", countries:["Egypt","Sudan"], lat:26, lon:31},

  // Seas/Oceans
  {name:"Aral Sea", type:"sea", seaName:"Aral Sea"},
  {name:"Black Sea", type:"sea", seaName:"Black Sea"},
  {name:"Caspian Sea", type:"sea", seaName:"Caspian Sea"},
  {name:"Indian Ocean", type:"sea", seaName:"Indian Ocean"},
  {name:"Mediterranean Sea", type:"sea", seaName:"Mediterranean Sea"},
  {name:"Persian Gulf", type:"sea", seaName:"Persian Gulf"},
  {name:"Red Sea", type:"sea", seaName:"Red Sea"},

  // Canals/Straits
  {name:"Bosphorus", type:"strait", countries:["Turkey"], lat:41.1, lon:29.0},
  {name:"Dardanelles", type:"strait", countries:["Turkey"], lat:40.2, lon:26.4},
  {name:"Suez Canal", type:"canal", countries:["Egypt"], lat:30.5, lon:32.3},
  {name:"Bab el-Mandeb", type:"strait", countries:["Yemen","Djibouti"], lat:12.6, lon:43.3},
  {name:"Hormuz", type:"strait", countries:["Iran","Oman"], lat:26.6, lon:56.3},

  // Mountains
  {name:"Caucasus", type:"mountain", countries:["Georgia","Armenia"], lat:42.5, lon:44.5},
  {name:"Himalayas", type:"mountain", countries:["Nepal","India"], lat:28, lon:87},
  {name:"Hindu Kush", type:"mountain", countries:["Afghanistan","Pakistan"], lat:35, lon:70},
  {name:"Tien Shan", type:"mountain", countries:["Kyrgyzstan","Kazakhstan"], lat:42, lon:80},

  // Countries (simplified, add all from your list)
  {name:"Afghanistan", type:"country", countryName:"Afghanistan"},
  {name:"Albania", type:"country", countryName:"Albania"},
  {name:"Armenia", type:"country", countryName:"Armenia"},
  {name:"India", type:"country", countryName:"India"},
  {name:"Egypt", type:"country", countryName:"Egypt"},

  // Cities
  {name:"Aden", type:"city", countries:["Yemen"], lat:12.8, lon:45},
  {name:"Herat", type:"city", countries:["Afghanistan"], lat:34.3, lon:62},
  {name:"Istanbul", type:"city", countries:["Turkey"], lat:41, lon:29},
  {name:"Mecca", type:"city", countries:["Saudi Arabia"], lat:21.4, lon:39.8},
  {name:"Medina", type:"city", countries:["Saudi Arabia"], lat:24.5, lon:39.6}
];

// Initialize map
const map = L.map('map').setView([30,40],3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load country polygons
fetch('countries.geo.json')
  .then(res => res.json())
  .then(json => {
    countriesLayer = L.geoJSON(json).addTo(map);
    showQuestion();
  });

// Load seas polygons
fetch('seas.geo.json')
  .then(res => res.json())
  .then(json => {
    seasLayer = L.geoJSON(json).addTo(map);
  });

// Show current question
function showQuestion(){
  if(currentIndex >= LOCATIONS.length){
    document.getElementById('question').innerText = "🏆 Quiz finished!";
    document.getElementById('feedback').innerText = "";
    document.getElementById('score').innerText = `Final score: ${score} / ${LOCATIONS.length}`;
    return;
  }
  document.getElementById('question').innerText = `Find: ${LOCATIONS[currentIndex].name}`;
}

// Check if point inside country polygon
function pointInCountry(click, countryName){
  if(!countriesLayer) return false;
  let inside = false;
  countriesLayer.eachLayer(layer => {
    if(layer.feature.properties.name === countryName){
      if(turf.booleanPointInPolygon([click.lng,click.lat], layer.feature.geometry)){
        inside = true;
      }
    }
  });
  return inside;
}

// Check if point inside sea polygon
function pointInSea(click, seaName){
  if(!seasLayer) return false;
  let inside = false;
  seasLayer.eachLayer(layer => {
    if(layer.feature.properties.name === seaName){
      if(turf.booleanPointInPolygon([click.lng,click.lat], layer.feature.geometry)){
        inside = true;
      }
    }
  });
  return inside;
}

// Get marker lat/lng for any type
function getMarkerLatLng(loc){
  if(loc.lat && loc.lon) return [loc.lat, loc.lon];

  // Country center
  if(loc.type === "country"){
    let marker = null;
    countriesLayer.eachLayer(layer => {
      if(layer.feature.properties.name === loc.countryName){
        const center = turf.center(layer.feature).geometry.coordinates;
        marker = center.reverse();
      }
    });
    return marker;
  }

  // Sea center
  if(loc.type === "sea" && seasLayer){
    let marker = null;
    seasLayer.eachLayer(layer => {
      if(layer.feature.properties.name === loc.seaName){
        const center = turf.center(layer.feature).geometry.coordinates;
        marker = center.reverse();
      }
    });
    return marker;
  }

  // River/Canal/Strait/City/Mountain → use first country center
  if(loc.countries && loc.countries.length > 0){
    let marker = null;
    countriesLayer.eachLayer(layer => {
      if(loc.countries.includes(layer.feature.properties.name)){
        const center = turf.center(layer.feature).geometry.coordinates;
        marker = center.reverse();
      }
    });
    return marker;
  }

  return null;
}

// Click handler
map.on('click', function(e){
  if(!countriesLayer || currentIndex >= LOCATIONS.length) return;

  const loc = LOCATIONS[currentIndex];
  const click = e.latlng;
  const correct = isCorrect(click, loc);

  if(correct) score++;

  document.getElementById('feedback').innerText = correct
    ? `✅ Correct!`
    : `❌ Wrong — ${loc.name}`;

  document.getElementById('score').innerText = `Score: ${score} / ${LOCATIONS.length}`;

  // Place marker
  const markerLatLng = getMarkerLatLng(loc);
  if(markerLatLng){
    L.marker(markerLatLng).addTo(map);
  }

  // Next question
  setTimeout(()=>{
    currentIndex++;
    showQuestion();
  }, 400);
});

// Check correctness
function isCorrect(click, loc){
  if(loc.type === "country"){
    return pointInCountry(click, loc.countryName);
  }
  if(loc.type === "sea"){
    return pointInSea(click, loc.seaName);
  }

  // Rivers, Canals, Straits, Cities, Mountains
  const inCountry = loc.countries && loc.countries.some(c => pointInCountry(click, c));
  const dist = loc.lat && loc.lon ? map.distance(click, [loc.lat, loc.lon]) : Infinity;
  const tolerance = 150000; // 150 km
  return inCountry || dist <= tolerance;
}
