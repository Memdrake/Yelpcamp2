mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/standard', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 14, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker({ color: 'black', rotation: 45 })
    .setLngLat(campground.geometry.coordinates) // its an array but we dont need the []
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h5>${campground.title}</h5><p>${campground.location}</p>`
        )
    )
    .addTo(map);