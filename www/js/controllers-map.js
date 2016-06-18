angular.module('starter.controllers-map')
  .controller('mapCtrl', function($scope, $geofire, $log) {
    var firebaseRef = new Firebase("https://map-chats.firebaseio.com");
    var geoFire = new GeoFire(firebaseRef);

    var ref = geoFire.ref();  // ref === firebaseRef

    });
