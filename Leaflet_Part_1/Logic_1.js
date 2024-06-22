let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});

function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
           radius: markerSize(feature.properties.mag),
           fillColor: markerColor(feature.geometry.coordinates[2]),
           color:"black",
           weight: 0.5,
           opacity: 0.5,
           fillOpacity: 1 });
}


function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
}


function createFeatures(data) {
    let earthquakes = L.geoJSON(data, {
                  onEachFeature: onEachFeature,
                  pointToLayer: createMarker
    });
    createMap(earthquakes);
}


function createMap(earthquakes) {
    
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

   
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    
    
    
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 90],
            labels = [],
            legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;

        };

      
        legend.addTo(myMap);
} 


function markerSize(magnitude) {
    return magnitude * 5;
}


function markerColor(depth) {
    return depth > 90 ? "darkred" 
        : depth > 70 ? "red" 
        : depth > 50 ? "orange" 
        : depth > 30 ? "yellow" 
        : depth > 10 ? "lightgreen" 
        : "green";
}             