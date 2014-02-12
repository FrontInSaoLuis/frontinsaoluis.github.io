var map;
var directions = new google.maps.DirectionsService();
var MY_MAPTYPE_ID = 'custom_style';

var latitude =  -2.527250;
var longitude = -44.255581;

var local = new google.maps.LatLng(latitude, longitude);

var info = new google.maps.InfoWindow({maxWidth: 200});

var marker = new google.maps.Marker({
position: local,
title: 'Manhattan Steakhouse',
draggable: true,
});

var mapOptions = {
zoom: 15,
center: local,
mapTypeControlOptions: {
  mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
},
mapTypeId: MY_MAPTYPE_ID
};
map = new google.maps.Map(document.getElementById('geo-wrapper'), mapOptions);

function show_map() {

   var featureOpts =  [
         {
           "featureType": "landscape",
           "elementType": "geometry",
           "stylers": [
             { "hue": "#dd00ff" },
             { "color": "#ded0a8" }
           ]
         },{
           "featureType": "road",
           "stylers": [
             { "color": "#72090c" }
           ]
         },{
           "featureType": "road",
           "elementType": "labels.text.fill",
           "stylers": [
             { "color": "#ffffff" }
           ]
         },{
           "featureType": "water",
           "elementType": "geometry",
           "stylers": [
             { "color": "#4c3919" }
           ]
         }
   ];

  var styledMapOptions = {
      name: 'Nosso mapa'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

  google.maps.event.addDomListener(window, 'load', show_map);

  marker.setMap(map);

  google.maps.event.addListener(marker, 'click', function() {
    info.setContent('<h4>Manhattan Steakhouse</h4> <br> Av. Daniel de La Touche, 987, 65074115 São Luís, Brazil');
    info.open(map, marker);
  });

  $("#btn-como-chegar").click(function(){
      
      $('#btn-como-chegar').html("Carregando...");

      if (geo_position_js.init()) {
        geo_position_js.getCurrentPosition(map_geo, show_map_error);
      }
      map_geo();
     function map_geo(loc) {

        var latitude_user = loc.coords.latitude;
        var longitude_user = loc.coords.longitude;
        
        info.close();
        marker.setMap(null);

        var origin = new google.maps.LatLng(latitude_user, longitude_user);
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var request = {
          origin: local,
          destination: origin,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directions.route(request, function(response, status){
          if(status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
          }
        });

        $('#btn-como-chegar').html("Sucesso!");

        var effect = setInterval(hiddenBtn, 5000);

        function hiddenBtn() {
          $("#btn-como-chegar").fadeOut();
          setTimeout(clearInterval(effect), 10000);
        }
     }
});
}
//Fallback case error in geolocalization
function show_map_error() {
$("#live-geolocation").html('Não foi possível determinar sua localização.');
}