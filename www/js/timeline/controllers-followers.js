angular.module('starter.controllers-followers', [])

/**
 * This version: 25/07/2015
 * Upcoming versions: Multi-Location Updates and more consistency
 */
.controller('FollowersCtrl', function(
    $scope,$rootScope, $state, $cordovaGeolocation,$stateParams,
      $ionicSlideBoxDelegate, $ionicPopup, $ionicActionSheet, $ionicHistory,
    Auth, Codes, Utils, Profile, Followers) {

    $scope.tempData = {noProfilePicture: "img/ionic.png"};
    $scope.loadingMode = true;
    $scope.searchUser = {value: ""};

    $scope.FollowingList        = Followers.FollowingList;
    $scope.FollowingProfiles    = Followers.FollowingProfiles;
    var options = {timeout: 10000, enableHighAccuracy: true};
    var firebaseRef = new Firebase("https://map-chats.firebaseio.com" + "/location");
    var geoFire = new GeoFire(firebaseRef);

    var ref = geoFire.ref();
    doRefresh();

    $scope.$on('$rootScope.refresh', function(){ // called when logged out for instance
        Followers.resetFollowing();
        $scope.doRefresh();
    });

    $scope.doRefresh = function() {
        doRefresh();
    };
    $scope.goToMapS = function() {
      $ionicHistory.nextViewOptions({

        disableBack: true
      });
      //alert(uid);
      $state.go('bb', {uid: $scope.AuthData.uid});
    };

    function doRefresh() {

        $scope.AuthData             = Auth.AuthData;

        if($scope.AuthData.hasOwnProperty('uid')) {
            Followers.refreshFollowing($scope.AuthData.uid).then(
                function(success){
                    refreshComplete();
                }, function(error){
                    refreshComplete();
                    handleError(error)
                }
            )
        } else {
            refreshComplete();
        };


    };

    //
    function refreshComplete() {
        $scope.FollowingList        = Followers.FollowingList;
        $scope.FollowingProfiles    = Followers.FollowingProfiles;

        $scope.searchUser = {value: ""};
        $scope.loadingMode = false;
        $scope.$broadcast('scroll.refreshComplete');
        return $scope.FollowingProfiles;
    };


    // -------------------------------------------------------------------------
    //
    // Add / Delete
    //
    // -------------------------------------------------------------------------

    $scope.addFollower = function() {
        if($scope.searchUser.value) {
            Utils.showMessage("Kullanıcı Aranıyor...");

            Followers.addFollower($scope.AuthData.uid, $scope.searchUser.value, true).then(
                function(success){
                    Utils.showMessage("Kullanıcı Ekleniyor...", 1000);
                    doRefresh();
                }, function(error){
                    handleError(error)
                }
            )

        }
    };

    $scope.stopFollowing = function(fid) {
        console.log("stopFollowing", fid)
        if(fid) {
            Followers.stopFollowing($scope.AuthData.uid, fid).then(
                function(success){
                    var a=refreshComplete();

                    angular.forEach(a, function(value, key){

                      alert(key);

                      });

                    doRefresh();

                }, function(error){
                    handleError(error)
                }
            )
        }
    };
    $scope.here = function(fid) {
        console.log("here", fid)
        if(fid) {
            alert(fid);
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){

          	      geoFire.get(fid).then(function(loc) {
               if (location === null) {
                 console.log("Provided key is not in GeoFire");
               }
               else {

                 //console.log("Provided key has a location of " + loc);
                    loc2 = new google.maps.LatLng(loc[0], loc[1]);

                    var marker = new google.maps.Marker({
                     map: $scope.map,
                     animation: google.maps.Animation.DROP,
                     position: loc2
                 });
               }

             },
             function(error) {
               console.log("Error: " + error);
             });

             var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

              var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };


              $scope.map = new google.maps.Map(document.getElementById("map2"), mapOptions);
              google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });






              });
            });
    }
    $state.go('bb', {uid: $scope.AuthData.uid});
  };
  $scope.goTotb = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('tab.map');
  };


    // -------------------------------------------------------------------------
    //
    // Other (can be put in service)
    //
    // -------------------------------------------------------------------------


    /**
    * Translates error codes to the language of commoners
    * Todo: put in service for consistency
    */
    function handleError(error) {
        Codes.handleError(error);
    };






})
