  function initMap() {
      var sofia = { lat: 42.691738, lng: 23.319809 };
      map = new google.maps.Map(document.getElementById('map'), {
          center: sofia,
          zoom: 15
      });

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
          location: sofia,
          radius: 500,
          type: ['night_club']
      }, callback);
  }