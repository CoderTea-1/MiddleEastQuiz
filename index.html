let currentIndex = 0;
let score = 0;
let countriesLayer;

// Full expanded location list with lat/lon + type and countryName when appropriate.
const LOCATIONS = [
  // Rivers
  {name:"Amu Darya", type:"river", lat:41, lon:63},
  {name:"Syr Darya", type:"river", lat:44, lon:67},
  {name:"Indus", type:"river", lat:30, lon:70},
  {name:"Euphrates", type:"river", lat:34, lon:40},
  {name:"Tigris", type:"river", lat:35, lon:44},
  {name:"Nile", type:"river", lat:26, lon:31},

  // Seas/Oceans
  {name:"Aral Sea", type:"sea", lat:45, lon:61},
  {name:"Black Sea", type:"sea", lat:43, lon:35},
  {name:"Caspian Sea", type:"sea", lat:42, lon:50},
  {name:"Indian Ocean", type:"sea", lat:-20, lon:80},
  {name:"Mediterranean Sea", type:"sea", lat:34, lon:18},
  {name:"Persian Gulf", type:"sea", lat:25, lon:50},
  {name:"Red Sea", type:"sea", lat:20, lon:38},

  // Straits/Canals
  {name:"Bosphorus", type:"sea", lat:41.1, lon:29.0},
  {name:"Dardanelles", type:"sea", lat:40.2, lon:26.4},
  {name:"Suez Canal", type:"sea", lat:30.5, lon:32.3},
  {name:"Bab el-Mandeb", type:"sea", lat:12.6, lon:43.3},
  {name:"Hormuz", type:"sea", lat:26.6, lon:56.3},

  // Mountains
  {name:"Caucasus", type:"mountain", lat:42.5, lon:44.5},
  {name:"Himalayas", type:"mountain", lat:28, lon:87},
  {name:"Hindu Kush", type:"mountain", lat:35, lon:70},
  {name:"Tien Shan", type:"mountain", lat:42, lon:80},

  // Countries
  {name:"Afghanistan", type:"country", countryName:"Afghanistan"},
  {name:"Albania", type:"country", countryName:"Albania"},
  {name:"Armenia", type:"country", countryName:"Armenia"},
  {name:"Azerbaijan", type:"country", countryName:"Azerbaijan"},
  {name:"Bahrain", type:"country", countryName:"Bahrain"},
  {name:"Bulgaria", type:"country", countryName:"Bulgaria"},
  {name:"China", type:"country", countryName:"China"},
  {name:"Cyprus", type:"country", countryName:"Cyprus"},
  {name:"Djibouti", type:"country", countryName:"Djibouti"},
  {name:"Egypt", type:"country", countryName:"Egypt"},
  {name:"Eritrea", type:"country", countryName:"Eritrea"},
  {name:"Ethiopia", type:"country", countryName:"Ethiopia"},
  {name:"Georgia", type:"country", countryName:"Georgia"},
  {name:"Greece", type:"country", countryName:"Greece"},
  {name:"India", type:"country", countryName:"India"},
  {name:"Iran", type:"country", countryName:"Iran"},
  {name:"Iraq", type:"country", countryName:"Iraq"},
  {name:"Israel", type:"country", countryName:"Israel"},
  {name:"Jordan", type:"country", countryName:"Jordan"},
  {name:"Kazakhstan", type:"country", countryName:"Kazakhstan"},
  {name:"Kirgizstan", type:"country", countryName:"Kyrgyzstan"},
  {name:"Kuwait", type:"country", countryName:"Kuwait"},
  {name:"Lebanon", type:"country", countryName:"Lebanon"},
  {name:"Libya", type:"country", countryName:"Libya"},
  {name:"Macedonia", type:"country", countryName:"North Macedonia"},
  {name:"Oman", type:"country", countryName:"Oman"},
  {name:"Pakistan", type:"country", countryName:"Pakistan"},
  {name:"Qatar", type:"country", countryName:"Qatar"},
  {name:"Romania", type:"country", countryName:"Romania"},
  {name:"Russia", type:"country", countryName:"Russia"},
  {name:"Saudi Arabia", type:"country", countryName:"Saudi Arabia"},
  {name:"Serbia", type:"country", countryName:"Serbia"},
  {name:"Somalia", type:"country", countryName:"Somalia"},
  {name:"Sudan", type:"country", countryName:"Sudan"},
  {name:"Syria", type:"country", countryName:"Syria"},
  {name:"Tajikistan", type:"country", countryName:"Tajikistan"},
  {name:"Turkey", type:"country", countryName:"Turkey"},
  {name:"Turkmenistan", type:"country", countryName:"Turkmenistan"},
  {name:"Ukraine", type:"country", countryName:"Ukraine"},
  {name:"United Arab Emirates", type:"country", countryName:"United Arab Emirates"},
  {name:"Uzbekistan", type:"country", countryName:"Uzbekistan"},
  {name:"Yemen", type:"country", countryName:"Yemen"},

  // Cities
  {name:"Aden", type:"city", lat:12.8, lon:45},
  {name:"Herat", type:"city", lat:34.3, lon:62},
  {name:"Istanbul", type:"city", lat:41, lon:29},
  {name:"Mecca", type:"city", lat:21.4, lon:39.8},
  {name:"Medina", type:"city", lat:24.5, lon:39.6}
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

function showQuestion(){
  if(currentIndex >= LOCATIONS.length){
    document.getElementById('question').innerText = "🏆 Quiz finished!";
    document.getElementById('feedback').innerText = "";
    document.getElementById('score').innerText = `Final score: ${score} / ${LOCATIONS.length}`;
    return;
  }
  document.getElementById('question').innerText = `Find: ${LOCATIONS[currentIndex].name}`;
}

// Country polygon test
function pointInCountry(click, countryName){
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

function isCorrect(click, loc){
  if(loc.type==="country"){
    return pointInCountry(click, loc.countryName);
  }
  // For seas/rivers/cities/mountains use radius check
  let tolerance = 50000;
  if(loc.type==="river") tolerance = 150000;
  if(loc.type==="sea") tolerance = 300000;
  if(loc.type==="city") tolerance = 50000;
  if(loc.type==="mountain") tolerance = 50000;

  const dist = map.distance(click, [loc.lat,loc.lon]);
  return dist <= tolerance;
}

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

  // Place marker at stored lat/lon
  if(loc.lat && loc.lon) {
    L.marker([loc.lat,loc.lon]).addTo(map);
  }

  setTimeout(()=>{
    currentIndex++;
    showQuestion();
  }, 400);
});
