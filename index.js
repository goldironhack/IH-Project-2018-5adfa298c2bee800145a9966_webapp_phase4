  const neighborhoodsnamesURL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD"
  const districtsNYURL = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
  const dataCrimesURL = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";

  /* Crime var data = $.ajax({
     url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json", //Crimes URL
      //type: "GET", Opcional
      data: {
        "$limit" : 5000,
        "$$app_token" : "YOURAPPTOKENHERE" // Opcional
        "$cmplnt_to_dt" : '2016-0515T00:00:00.000'
      }
  }).done(function(data) {
    //alert("Retrieved " + data.length + " records from the dataset!");
    console.log(data);
  });
  */

  var map;
  var ny_coordinates = {lat: 40.720610, lng: -73.995242};
  var bro_coordinates = {lat: 40.5002, lng: -73.949997};
  var ny_university = {lat: 40.729576, lng: -73.996481};
  var nyu_marker;
  var bro_marker;
  var directionsService;
  var directionsRenderer;
  var allDistrictMarkersFlag = false;


  /*
  function initMap(){
      map = new google.maps.Map(document.getElementById('map'), {
          zoom : 10,
          center: ny_coordinates
      });
      ny_marker = new google.maps.Marker({
          position: ny_coordinates,
          map: map
      });
      bro_marker = new google.maps.Marker({
          position: bro_coordinates,
          map: map
      });

      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer();
      markerEvents(bro_marker);
  }
  function markerEvents(marker){
      if(marker != "undefined"){
          marker.addListener("click",function(){
              getRoute();
          });
      }
  }
  function getRoute(){
      var request = {
          origin: ny_marker.position,
          destination: bro_marker.position,
          travelMode: 'DRIVING'
      };
      directionsRenderer.setMap(map);
      directionsService.route(request,function(result,status){
          if(status == "OK"){
              directionsRenderer.setDirections(result);
          }
      });
  } */
  /*
  var request = new XMLHttpRequest();
  request.open('GET', districtsNYURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    var districtsPolygons = request.response;

  }*/



  var geometry;
  var BoroCD;
  var APushed = false;
  var NYNHNames = [];
  var NYNHMarkers = [];
  var NYNHbounds;

  $(document).ready( function(){
    $("#getDataButton").on("click", updateAllDatasets);  // Buttons
    $("#startMapButton").on("click", goMarker);
    $("#updateTableButton").on("click", updateTable);
    $("#showAllNeighborhoods").on("click", showAllNeighborhoods);
    $("#showAllMultipolygons").on("click", showAllMultipolygonsProperties);
  })


  function updateTable(){
    tableReference = $("#neighboorhoodsTableBody")[0];
    var newRow, state, pos;      // Hacer focus;
    for (var i = 0; i < NYNHNames.length; i++) {
      newRow = tableReference.insertRow(tableReference.rows.length);
      state = newRow.insertCell(0);
      pos = newRow.insertCell(1);
      state.innerHTML = NYNHNames[i].name;
      pos.innerHTML = "Fix";
    }
  }

  function getDataFromUrl(URL, callback){
    var data = $.get(URL, function(){

    })
    .done(callback(URL))
    .fail( function(error){
      console.error(error);
    })
  }
  function EstoFunciona(URL){
    console.log(URL);
    //console.log("Funciona");

  }

  function updateAllDatasets(){

    getDataFromUrl(neighborhoodsnamesURL,getNeighboorhoodsName);
    getDataFromUrl(dataCrimesURL,getDataCrimes);
    getDataFromUrl(districtsNYURL,drawCityFocus);
  //  getDataFromUrl(dataCrimesURL,EstoFunciona);

  }

  function initMap() {
  //  google.maps.event.addDomListener(map, 'click', initMap);
           map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: ny_coordinates,
          styles: [   //Blue essence
      {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#e0efef"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "hue": "#1900ff"
              },
              {
                  "color": "#c0e8e8"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "lightness": 100
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "lightness": 700
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#7dcdcd"
              }
          ]
      }
  ],

          noClear: true,
          clickableIcons: false,
          disableDoubleClickZoom: true,
          fullscreenControl:false,
          draggable: false,
          disableDefaultUI: true,
          keyboardShortcuts: false,
        });


        nyu_marker = new google.maps.Marker({

          position: ny_university,
          animation: google.maps.Animation.DROP,
          title:"NYU",

        });

  }
    function Start(){
  updateAllDatasets();
    var i = 0;
    function intro(){
      if (i<50){

        document.getElementById("floating-panel").style.opacity=1-(i/50);
        document.getElementById("map").style.opacity= i/50;
        $(".buttons-nav").css("opacity",i/25);
        $(".head-text").css("opacity",i/100);

        i++;
        setTimeout(intro,20);

      }
      else {
        document.getElementById("floating-panel").innerHTML='';
        setTimeout(goMarker,700);
      }



    }
    intro();
    }

    function showAllNeighborhoods(){
        var i = 0, to =  NYNHNames.length;
        if(!allDistrictMarkersFlag){
          allDistrictMarkersFlag=true;
        if(to!=0){
        smoothMarkers();
        }

      }
      function smoothMarkers(){
        if(i!=to-i-1){
          NYNHMarkers[i].setMap(map);
          NYNHMarkers[to-i-1].setMap(map);
        }
        else {
            NYNHMarkers[i].setMap(map);

        }
          i++;
          if(i < to/2){
             setTimeout(smoothMarkers,10);
          }
          else return;
      }
    }

    function goMarker(){   //zoom

  if(APushed){
    map = nyu_marker.getMap();
    map.setCenter(nyu_marker.getPosition());
    smoothZoom(map, 14, map.getZoom());

  } else {
    APushed = true;
    nyu_marker.setMap(map)
       //Toma todos los datas sets de una vez
      showAllBoroughts();         //Pintar Los 5 Borughts

      map = nyu_marker.getMap();
      map.setCenter(nyu_marker.getPosition());
      smoothZoom(map, 12, map.getZoom());
  }
        }

        function smoothZoom (map, max, cnt) {
      if (cnt >= max) {
          nyu_marker.setAnimation(null);
          nyu_marker.setLabel("NYU");
          map.setOptions({
            clickableIcons: true,
            disableDoubleClickZoom: false,
            fullscreenControl:true,
            draggable: true,
            disableDefaultUI: false,
            keyboardShortcuts: true ,
          });
          return;
      }
      else {
      nyu_marker.setAnimation(google.maps.Animation.BOUNCE);
      map = nyu_marker.getMap();
      map.setCenter(nyu_marker.getPosition());
          z = google.maps.event.addListener(map, 'zoom_changed', function(event){
              google.maps.event.removeListener(z);
              smoothZoom(map, max, cnt + 0.2);
          });

          setTimeout(function(){map.setZoom(cnt)}, 100);
      }
  }


  /*function drawPolygon(polygon,stColor,fllColor){
      var shape = new google.maps.Polygon({
            paths: polygon,
            strokeColor: stColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fllColor,
            fillOpacity: 0.35
          });
      shape.setMap(map);
  }*/
  function getDataCrimes(URL){

   var data = $.ajax({
       url: URL+"?cmplnt_to_dt=2015-12-31T00:00:00.000", //Crimes URL
        type: "GET",
        data: {

       $$app_token : "vKDx4qUKNDxO4K9cCCF8pjibw", // Opcional
          //"$cmplnt_to_dt" : "2016-05-15T00:00:00.000"
        }
    }).done(function(data) {
      //alert("Retrieved " + data.length + " records from the dataset!");
      console.log(data);
    });

}
  function getNeighboorhoodsName(URL){    // get the names of every neighborhood, a similar method will get centroid

   NYNHbounds = new google.maps.LatLngBounds();
   if(NYNHNames.length==0){
     $.getJSON(URL, function (data) {
       console.log(data);
       $.each(data.data, function (key, val) {
         var MarkerPosition = {lat: parseFloat(val[9].slice(7).replace(")","").split(" ")[1]), lng:parseFloat(val[9].slice(7).replace(")","").split(" ")[0])},
         NBH_marker =  new google.maps.Marker({
         label:val[10].charAt(0),
         position: MarkerPosition,

         animation: google.maps.Animation.DROP,
         icon: {
        path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
        scale: 1,
        labelOrigin: new google.maps.Point(0, -10),
    //    anchor: new google.maps.Point(0, 32)

      },
         title:val[10]
       });
       //console.log({lat: parseFloat(val[9].slice(7).replace(")","").split(" ")[1]), lng:parseFloat(val[9].slice(7).replace(")","").split(" ")[0])});

        var parseName = JSON.parse('{"name":"'+val[10]+'"}');
       //  var name = {name: , val[10], point:, val[9].slice(7).replace(")","").split(" ")+'"}';
         NYNHNames.push(parseName);
         NYNHMarkers.push(NBH_marker);
         var infowindow = new google.maps.InfoWindow({
               content: val[10]
             });
         NBH_marker.addListener('mouseover', function() {
infowindow.open(map, NBH_marker);

    });
    NBH_marker.addListener('mouseout', function() {
infowindow.close();

});

     })

   });
   }
  }
  function drawCityFocus(URL){
    /*var coordinatesBorder = map.getBounds();
    var items = [];
    var BoundsCoords = [
      {lat: coordinatesBorder.f.b, lng: coordinatesBorder.b.b},
      {lat: coordinatesBorder.f.b, lng: coordinatesBorder.b.f},
      {lat: coordinatesBorder.f.f, lng: coordinatesBorder.b.f},
      {lat: coordinatesBorder.f.f, lng: coordinatesBorder.b.b}
    ];


    $.getJSON(URL, function (data) {// QUESTION: How to get and DRAW de multypoligons in a right way?
                 $.each(data.features, function (key, val) {

                   var coords = [];

                   $.each(val.geometry.coordinates, function(first,second){
                     if (val.geometry.type=="Polygon") {
                       for (var i = 0; i < second.length; i++) {
                        // console.log("{lat: "+j[i][1]+" lng: "+j[i][0]+"}");
                        //console.log(jsonCoords);

                         coords.push(JSON.parse(JSON.stringify({lat: +second[i][1], lng: +second[i][0]})));
                       }

                     } else {

                       for (var i = 0; i < second[0].length; i++) {
                        //console.log("{lat: "+j[0][i][1]+" lng: "+j[0][i][0]+"}");
                      //  coords.push("{lat: "+j[0][i][1]+" lng: "+j[0][i][0]+"}");

                        coords.push(JSON.parse(JSON.stringify({lat: +second[0][i][1], lng: +second[0][i][0]})));
                       }
                     }

                   })

  items.push(val.geometry.type,coords);
  });
  //drawPolygon(BoundsCoords,'#1a0d00','#87CEFA');

  for (var i = 0; i < (items.length/2)-1; i++) {

   if (items[2*i]=="Polygon"){

     map.data.add({geometry: new google.maps.Data.Polygon([items[2*i+1]])});
   }
   else {
  // Can´t draw the multipoligons in a right way..

   }
  }
  }); */


  map.data.loadGeoJson(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson'
    );
    // Set the global styles.
  //console.log(map.data);
  map.data.setStyle({

  strokeWeight: 3,
  strokeOpacity: 0.4,
  fillOpacity: 0.3
  }

  );
  map.data.addListener('click', function(event) {
  var color = getRandomColor();

     map.data.overrideStyle(event.feature, {fillColor: color});
  });

  //drawPolygon(triangleCoords);

  //console.log(items[0]);

    function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
      for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
      }
    return color;
    }
  }

  function showAllMultipolygonsProperties(){
  console.log(map.data);
    map.data.forEach(function(feature) {
  console.log(feature.f.BoroCD);
      if (feature.getGeometry().getType() == "MultiPolygon"){
          //console.log("Funciona");
          map.data.overrideStyle(feature, {fillColor: 'red'});
      }


  });
  }
  function showAllBoroughts(){

    map.data.forEach(function(feature) {
      var BoroughtNumber = Math.floor(feature.f.BoroCD/100);
    //  console.log(BoroughtNumber);
    switch (BoroughtNumber) {
      case 1:
        map.data.overrideStyle(feature, {fillColor: '#364a9e'});  // Manhattan
        break;
      case 2:
        map.data.overrideStyle(feature, {fillColor: '#de4135' }); //The Bronx
        break;
      case 3:
      map.data.overrideStyle(feature, {fillColor: '#fadc3b'}); //Brooklyn
        break;
      case 4:
      map.data.overrideStyle(feature, {fillColor: '#f5893b'}); //Queens
        break;
      case 5:
      map.data.overrideStyle(feature, {fillColor: '#954291'});  //Staten Island
        break;

    }



  });
  }
