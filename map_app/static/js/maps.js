
//Initialise map
//base-maps details
var mbAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
   mbUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

var basemap   = L.tileLayer(mbUrl, {attribution: mbAttr});

var map = L.map('map', {
  center: [38.574875,68.812003],
  zoom: 11,
  layers: [basemap]
});

$.getJSON('/boxes', function(json) {
        var data = [];
        for (var i = 0; i < json.length; i++) {
          var item = json[i];
         data[i]  = [parseFloat(item.geometry.coordinates[0]),
                    parseFloat(item.geometry.coordinates[1]), item.properties.description];
        }
      draw_map(data);
      }
    );

function draw_map(data){
    //Define uniform display layer
    var uniform__circles = L.layerGroup();
          
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var xy  = [item[0],item[1]];
        var circle = L.circle(xy, {
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.5,
          radius: 200
      }).addTo(uniform__circles);
    }

    //Draw based on values
    var interpolate = d3.interpolateNumber(0, 24);
    var size_based_circles = L.layerGroup();
    for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var xy  = [item[0],item[1]];
            var circle = L.circle(xy, {
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.5,
              radius: interpolate (item[2])*10
          }).addTo(size_based_circles);
    }

    var baselayer = {"Base-maps": basemap};

    var overlays = {
        "Uniform_display": uniform__circles,
        "Size_based_display": size_based_circles
    };

    L.control.layers(baselayer, overlays).addTo(map);
}


//Draw heatmap
function draw_heat_map(){
  $.getJSON('/boxes', function(json) {
        var data = [];
        for (var i = 0; i < json.length; i++) {
          var item = json[i];
         data[i]  = [parseFloat(item.geometry.coordinates[0]),
                    parseFloat(item.geometry.coordinates[1]), item.properties.description];
        }

      var heat = L.heatLayer(data,{radius: 20,blur: 20, maxZoom: 5}).addTo(map),
          draw = true;

      /*map.on({
          movestart: function () { draw = false; },
          moveend:   function () { draw = true; },
          mousemove: function (e) {
          if (draw) {
            heat.addLatLng(e.latlng);
            }
          }
        })*/
      }
    );
}
//grab clicked lat_lon and send to python backend for predicting outage
map.on('click', function(e) {
  var clicked_latlon = {'lat': e.latlng.lat, 'lon': e.latlng.lng};
  $.ajax
  ({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    //the url where you want to sent the userName and password to
    url: '/click_loc',
    async: false,
    //json object to sent to the authentication url
    data: JSON.stringify(clicked_latlon),
    
    success: function (data) {
      var circle = L.circle(clicked_latlon, {
          color: 'red',
          fillColor: 'red',
          fillOpacity: 0.5,
          radius: 150
      }).addTo(map);

      alert('Date: ' +  data[0] + 
              '\n (Predicted) Was there a power outage? : ' + data[1] + 
              '\n (Predicted) The average number of hours power was out : ' + Math.round(data[2]));
    }
})

});







