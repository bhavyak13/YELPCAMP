mapboxgl.accessToken = mapToken;
// mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhdnlhazEzIiwiYSI6ImNsMjA1NXlxNjBzdXMzY2xwN20wM2hwNXgifQ.2dPmD3Uq6WFRBSKn7Sieaw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: obj.geometry.coordinates, // starting position
    zoom: 10 // starting zoom
});
// new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

new mapboxgl.Marker()
    .setLngLat(obj.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${obj.title}</h3><p>${obj.location}</p>`
            )
    )
    .addTo(map);