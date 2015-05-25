angular.module('axil.explorectrl', [])

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
//                                 EXPLORE CONTROLLER                                   //
//                                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////

// Controller for the Explore Page
// Functions: Load the Explore map, retrieve media data from the API, cluster data by location and filter by time (TODO)
.controller('ExploreCtrl', function($scope, $rootScope, $cordovaGeolocation, $cordovaSocialSharing, $ionicPlatform, $ionicModal, MediaFactory, MapFactory, TokenFactory, Socket, Mapbox) {
  // Wrapper function that listens for when the state is ready

  $ionicPlatform.ready(function() {

    $scope.getLocation = function(initial){
      var posOptions = { timeout: 30000, enableHighAccuracy: true };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position){
          if(initial){
            MapFactory.userMarker(position.coords, $scope.user);  
          }
          $scope.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
          MapFactory.updateUserPosition(position.coords);
        }, function(err){
          console.log(err);
        });
    };

    $scope.getLocation(true);
    $scope.markerInfo = {};

    //CLUSTER MODAL provides a list of media visible in the map.
    var mapListModal = $ionicModal.fromTemplateUrl('map-list-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    });
    mapListModal.then(function(modal){
      $scope.listModal = modal;
    });

    $scope.openListModal = function(){
      $scope.listModal.show();
    };

    $scope.closeListModal = function(){
      $scope.listModal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.listModal.remove();
    });

    //MARKER MODAL detailed view of media
    var markerModal = $ionicModal.fromTemplateUrl('marker-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    });

    markerModal.then(function(modal){
      $scope.markerModal = modal;
    });

    //opens the modal from a map marker click data is provided to modal by the marker.
    $scope.openMarkerModal = function(){
      $scope.markerModal.show();
    };

    //opens the modal from the list view data is provided by the list view and passed as a parameter
    $scope.openMarkerModalFromList = function(media){
      $scope.markerInfo = media.mediaData;
      $scope.markerModal.show();
      $scope.closeListModal();
    };

    $scope.closeMarkerModal = function(){
      $scope.markerModal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.markerModal.remove();
    });


    var your_api_code = Mapbox.APIKey;

    // Load the Default Map
    L.mapbox.accessToken = your_api_code;
    $scope.map = L.mapbox.map('map', 'mapbox.streets').setView([30.2698848, -97.7444182], 16);
    $scope.clusters = new L.MarkerClusterGroup({
      // The iconCreateFunction takes the cluster as an argument and returns
      // an icon that represents it. We use L.mapbox.marker.icon in this
      // example, but you could also use L.icon or L.divIcon.
      iconCreateFunction: function(cluster) {
        return L.mapbox.marker.icon({
          // show the number of markers in the cluster on the icon.
          'marker-symbol': cluster.getChildCount(),
          'marker-color': '#DB504A',
          'marker-size': 'large'
        });
      }
    });

    // Center the map on a selected marker and open modal
    $scope.clusters.on('click', function(e) {
      $scope.map.panTo(e.layer.getLatLng());
      $scope.markerInfo = e.layer.mediaData;
      $scope.openMarkerModal();
    });

    $scope.map.on('move', onmove);

    function onmove() {
      var inBounds = []
        // Get the map bounds - the top-left and bottom-right locations.
        var bounds = $scope.map.getBounds();
        $scope.clusters.eachLayer(function(marker) {
            // For each marker, consider whether it is currently visible by comparing
            // with the current map bounds.
            if (bounds.contains(marker.getLatLng())) {
                inBounds.push(marker);
            }
        });
        return inBounds;
    };

    $scope.listView = function(){
      $scope.inBounds = onmove();
      $scope.openListModal();
    };

    // Add the user marker to the map
    $scope.user = new L.mapbox.featureLayer().addTo($scope.map);

    // Fetch the media from the API
    MediaFactory.getAllMedia()
      .then(function(data){
        //Get media data from server for listview modal
        // Populate the map with media clusters
        MapFactory.populateMap(data.data, $scope.clusters, $scope.map);
    });

    // Socket connection listening for new media on the database
    Socket.on('mediaInsert', function(data) {
      MapFactory.addMarkerToMap(data, $scope.clusters, $scope.map);
    });
    
    // Socket Listeners for Media Changes
    Socket.on("media_changed", function(media_id) {
      MapFactory.replaceMarker(media_id, $scope.clusters, $scope.map);
    });

    // Socket Listener for Media Deletion
    Socket.on("media_removed", function(media_id) {
      MapFactory.removeMarker(media_id, $scope.clusters, $scope.map);
    });

    // Center the map on the user when selected
    $scope.user.on('click', function(e) {
      $scope.map.panTo(e.layer.getLatLng());
    });

    // User Like Media (button in the Media Modal View)
    $scope.likeMedia = function(media_id) {
      $scope.user_id = TokenFactory.getUserId();
      MediaFactory.likeMedia(media_id, $scope.user_id)
        .then(function(res) {
          if (res.status === 201) {
            $scope.markerInfo.likes ++;
          } else if (res.status === 200) {
            alert("You've already liked that media!");
          } else {
            console.log("There was an issue with the Axil Servers");
          }
        });
    };

    $scope.mediaShare = function(uri) {
      console.log("inside media share", uri);
      var message = "Check out this media I found on Axil!";
      var subject = "" + $scope.user + " via Axil Mobile";
      $cordovaSocialSharing
      .share(message, subject, null, uri)
      .then(function(result) {
        console.log("Success");
      }, function(err) {
        console.log("Error: ", err);
      });
    }

  });

 });