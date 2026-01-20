// Basic quiz items for testing
// Later replace with full LOCATIONS array
const QUESTIONS = [
  { name: "Egypt", lat: 26.8206, lon: 30.8025 },
  { name: "India", lat: 22.0, lon: 79.0 },
  { name: "Turkey", lat: 39.0, lon: 35.0 }
];

let currentIndex = 0;
let score = 0;

// Initialize Leaflet map
const map = L.map('map').setView([30, 40], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Show first question
updateQuestion();

// Map click handler
map.on('click', function(e) {
  const { lat, lng } = e.latlng;
  const q = QUESTIONS[currentIndex];

  // Simple distance check
  const distance = map.distance([lat, lng], [q.lat, q.lon]);
  const correct = distance < 300000; // 300 km tolerance

  if (correct) {
    score++;
    document.getElementById('feedback').innerText = "✅ Correct!";
  } else {
    document.getElementById('feedback').innerText =
      `❌ Wrong! Click was off by ~${Math.round(distance/1000)} km.`;
  }

  document.getElementById('score').innerText = `Score: ${score}/${QUESTIONS.length}`;

  // Mark actual location
  L.marker([q.lat, q.lon]).addTo(map);

  // Move to next after short delay
  currentIndex++;
  if (currentIndex < QUESTIONS.length) {
    setTimeout(updateQuestion, 500);
  } else {
    setTimeout(showFinal, 500);
  }
});

function updateQuestion() {
  document.getElementById('question').innerText =
    `Find: ${QUESTIONS[currentIndex].name}`;
  document.getElementById('feedback').innerText = "";
}

function showFinal() {
  document.getElementById('question').innerText = "🎉 Quiz complete!";
  document.getElementById('feedback').innerText = "";
  document.getElementById('score').innerText = `Final: ${score}/${QUESTIONS.length}`;
}
