(function(root) {

  root.ShowMap = React.createClass({
    componentDidMount: function() {
      var lat = parseFloat(this.props.lat);
      var lng = parseFloat(this.props.lng);

      var map = React.findDOMNode(this.refs.map);
      var mapOptions = {
        center: {lat: lat, lng: lng},
        zoom: 13
      };

      this.map = new google.maps.Map(map, mapOptions);
      this.marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: this.map,
        title: "harvest"
      });

    },

    render: function() {
      return(
        <div id="map" ref="map" className="col-md-7"></div>
      )
    }
  });

}(this));