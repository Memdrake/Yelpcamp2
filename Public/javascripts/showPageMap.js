const campground = require("../../models/campground");

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: campground.geometry.coordinates,
    zoom: 13,
    style: 'mapbox://styles/mapbox/streets-v12',
});

// Create a new marker.
/* new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map); */