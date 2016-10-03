 var myLatLng = {lat: 37.3710062, lng: -122.0375932};
      var map ="";
      var locations = [];
      // create blank array for all interest points
      var markers = [];
      var largeInfowindow = null;

      function initMap(){         
        // Create a map object and specify the DOM element for display.
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: myLatLng
          });

           // info window to show information on the marker clicked we have one info window at a time 
           // so we initialize a blank InfoWindow to begin with and update it when a marker is clicked.
          largeInfowindow = new google.maps.InfoWindow();                 
      }
      
     
      // make async request to FourSquare API and get topPicks at our Location
      function searchFourSqr(){
        //var fourSqrUrl = "https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=AC03210WVNTTVRWGF3V4SFLBUAPEDUGCGZEAIQW2T00ASB2R&client_secret=SCYEC5BPCBTKDH1G1EXN2RHSNYA1IAXKULRLRMFRQ200MHUM&v=20160928"
       var fourSqrUrl =  "https://api.foursquare.com/v2/venues/explore?ll=" + myLatLng.lat + "," + myLatLng.lng + "&section=topPicks&client_id=AC03210WVNTTVRWGF3V4SFLBUAPEDUGCGZEAIQW2T00ASB2R&client_secret=SCYEC5BPCBTKDH1G1EXN2RHSNYA1IAXKULRLRMFRQ200MHUM&v=20160928"
       $.ajax({
              url: fourSqrUrl,
              success: function(data) {
                var list = "<b> FourSquare Venues </b><br> <ul>";
                /*var venuesCount = data.response.venues.length;
                for (var i =0; i< venuesCount; i++){
                  list += data.response.venues[i].name + '<br>';
                }; */
                var recommendationsCount = data.response.groups[0].items.length;
                for (var i =0; i< recommendationsCount; i++){
                  var venue = data.response.groups[0].items[i].venue;
                  var name = data.response.groups[0].items[i].venue.name;
                  locations[i]= {title: name, 
                                 latLng: {lat: data.response.groups[0].items[i].venue.location.lat, lng: data.response.groups[0].items[i].venue.location.lng},
                                 address: venue.location.formattedAddress[0] + ", " + venue.location.formattedAddress[1],
                                 rating: venue.rating,
                                 ratingColor: venue.ratingColor,
                                 category: venue.categories[0].name,
                                 menu: (venue.menu) ? venue.menu.url : '' ,
                                 url: (venue.url) ? venue.url : '',
                                 id: i
                               };
                  list +=  '<li>' + locations[i].title + '</li>';
                };

                  list += '</ul>';
                  $(options).html(list);
                  initMarkers(locations);
                }
              }); 
          
       //$(options).load(fourSqrUrl); // test the url
      }
     
        searchFourSqr(); 
      function initMarkers(markerLocations) {
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < markerLocations.length; i++) {
          // Get the position from the location array.
          var position = markerLocations[i].latLng;
          var title = markerLocations[i].title;
          // keep the same smae ID for locations and markers to easily access the Locations[] data for a marker
          var id = markerLocations[i].id;  
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            //icon: defaultIcon,
            map: map,
            id: id
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
             populateInfoWindow(this, largeInfowindow);
          });
        };
      }
      
      function populateInfoWindow(marker,infoWindow){
         if (infoWindow.marker != marker) {
          var id = marker.id;
          var content ="";
          // Clear the infowindow content to give the streetview time to load.
          // locations data for this marker exists display it on the infoWindow
          if (locations[id]){
              locn = locations[id];
               content= '<div><b>' + marker.title + '</b></div><div>';
               content +=  'Rating: ' + locn.rating ;
               content +=  '<br>' + locn.address;
               content +=  '<br>' + locn.category;
               if (locn.menu.length >4){
                   content += '<span class="displayMenu"><a href="' + locn.menu + '" target="_blank">Menu</a></span>';
               };
               content +=  '</div> '
               infoWindow.setContent(content);     
          } else
          {
            infowindow.setContent('<div><b>' + marker.title + '</b></div>' +
                '<div>No Details data Found</div>');
          };
          infoWindow.marker = marker;
          // Open the infowindow on the correct marker.
          infoWindow.open(map, marker);
          // Making sure the marker property is cleared if the infowindow is closed.
          infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
          });
        }
        
      }


      

      

