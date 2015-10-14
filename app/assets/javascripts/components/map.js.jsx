(function(root) {

  root.Map = React.createClass({

    componentDidMount: function() {
      var map = React.findDOMNode(this.refs.map);
      var mapOptions = {
        center: {lat: 37.7758, lng: -122.435},
        zoom: 13
      };
      this.markers = {};
      this.map = new google.maps.Map(map, mapOptions);
      this.infoWindow = new google.maps.InfoWindow({map: map});
      this._handleGeolocation();


      this.map.addListener('idle', this._handleIdleEvent);
      HarvstStore.addChangeListener(this._adjustMarkers);
      //
      // this.map.addListener('click', this.props.handleMapClick);
    },

    _handleGeolocation: function() {
      var that = this;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          that.infoWindow.setPosition(pos);
          that.infoWindow.setContent('Location found.');
          that.map.setCenter(pos);
        }, function() {
          that.handleLocationError(true, infoWindow, map.getCenter()).bind(that);
        });
      } else {
        that.handleLocationError(false, infoWindow, map.getCenter()).bind(that);
      }
    },

    handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
      this.infoWindow.setPosition(pos);
      this.infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    },


    _handleIdleEvent: function() {
      var bounds = this.map.getBounds();
      var northEast = bounds.getNorthEast();
      var southWest = bounds.getSouthWest();
      var northEastCoords = {lat: northEast["J"], lng: northEast["M"]};
      var southWestCoords = {lat: southWest["J"], lng: southWest["M"]};
      var boundsObj = {bounds: {northEast: northEastCoords, southWest: southWestCoords}};
      // FilterActions.receiveAll(boundsObj);

    },
    //
    // _handleMarkerClick: function(id) {
    //   this.history.pushState(null, "show/"+id);
    // },
    //
    _adjustMarkers: function() {
      var harvsts = HarvstStore.all();
      var that = this;

      harvsts.map(function(harvst) {
        if (typeof that.markers[harvst.id] === 'undefined') {
          var marker = new google.maps.Marker({
            position: {lat: harvst.lat, lng: harvst.lng},
            map: that.map,
            title: harvst.title
          });
          marker.addListener('click', that._handleMarkerClick.bind(that, harvst.id));
          that.markers[harvst.id] = marker;
        }
      });
      //
      // var bikeids = bikes.map(function(bike) {return String(bike.id);});
      //
      // Object.keys(this.markers).map(function(markerBikeId) {
      //   if (bikeids.indexOf(markerBikeId) === -1) {
      //     that.markers[markerBikeId].setMap(null);
      //     delete that.markers[markerBikeId];
      //   }
      // });
    },

    render: function() {
      return(
        <div id="map" ref="map" className="col-md-7"></div>
      )
    }
  });

}(this));
