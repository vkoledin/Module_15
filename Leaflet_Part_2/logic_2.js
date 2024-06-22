let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
let plateUrl = "data/PB2002_boundaries.json"


d3.json(queryUrl).then(function(data) {
    d3.json(plateUrl).then(function(plateData) {
       createFeatures(data.features, plateData.features);
    });
});


function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"Black",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function createFeatures(data, plateData) {
   
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    
    let earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });
    
    let plates = L.geoJSON(plateData, {
        style: function() {
            return {
                color: "blue",
                weight: 2.5
            }
        }
    });

   
    createMap(earthquakes, plates);
}

function createMap(earthquakes, plates) {
   
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

    
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

   
    let overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": plates
    };

   
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes, plates]
    });

    
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap); 
    
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