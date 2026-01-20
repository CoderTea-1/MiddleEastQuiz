map.on('click', function(e){
    if(currentIndex >= LOCATIONS.length) return;

    const loc = LOCATIONS[currentIndex];
    const distance = map.distance(e.latlng, [loc.lat, loc.lon]);
    const tolerance = 500000; // 500 km

    // Show target circle
    L.circle([loc.lat, loc.lon], {
        color: 'green',
        fillColor: '#0f0',
        fillOpacity: 0.2,
        radius: tolerance
    }).addTo(map);

    if(distance < tolerance){
        score++;
        alert("Correct!");
    } else {
        alert(`Wrong! Correct location: ${loc.lat}, ${loc.lon}`);
    }

    // Snap marker to correct location
    L.marker([loc.lat, loc.lon]).addTo(map);

    currentIndex++;
    showQuestion();
});
