// Full list of rivers, seas, mountains, and countries (subset shown here)
const LOCATIONS = [
  {name: "Amu Darya", lat: 41.0, lon: 63.0},
  {name: "Syr Darya", lat: 44.0, lon: 67.0},
  {name: "Indus River", lat: 30.0, lon: 70.0},
  {name: "Euphrates River", lat: 34.0, lon: 40.0},
  {name: "Tigris River", lat: 35.0, lon: 44.0},
  {name: "Nile River", lat: 26.0, lon: 31.0},
  {name: "Black Sea", lat: 43.0, lon: 35.0},
  {name: "Mediterranean Sea", lat: 34.0, lon: 18.0},
  {name: "India", lat: 22.0, lon: 79.0},
  {name: "Turkey", lat: 39.0, lon: 35.0}
  // Add all your 80+ locations here
];

let currentIndex = 0;
let score = 0;

const map = L.map('map').setView([30, 40], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function showQuestion() {
    if(currentIndex >= LOCATIONS.length){
        document.getElementById('question').innerText = "Quiz finished!";
        document.getElementById('score').innerText = `Your score: ${score} / ${LOCATIONS.length}`;
        return;
    }
    document.getElementById('question').innerHTML = `Find: <b>${LOCATIONS[currentIndex].name}</b>`;
}

map.on('click', function(e){
    if(currentIndex >= LOCATIONS.length) return;

    const loc = LOCATIONS[currentIndex];
    const distance = map.distance(e.latlng, [loc.lat, loc.lon]);
    if(distance < 200000){ // ~200 km tolerance
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! Correct location: ${loc.lat}, ${loc.lon}`);
    }
    L.marker([loc.lat, loc.lon]).addTo(map);
    currentIndex++;
    showQuestion();
});

showQuestion();
