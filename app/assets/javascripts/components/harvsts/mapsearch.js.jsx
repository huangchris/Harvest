(function(root) {

  root.MapSearch = React.createClass({
    getInitialState: function() {
      return ({address: ""});
    },

    _handleChange: function(e) {
      this.setState({address: e.target.value});
    },

    _handleSearch: function(e) {
      e.preventDefault();
      LocationUtil.fetchCoords(this.state.address, function() {});
      e.target.value = '';
    },

    _handleAddClick: function() {
      var coords, location;
      if (this.state.address.length === 0) {
        this.props.history.pushState(null, "/harvsts/new", root.position);
      } else {
        LocationUtil.fetchCoords(this.state.address, function() {
          coords = LocationStore.getCoords();
          location = {
            lat: coords.lat,
            lng: coords.lng
          };
          this.props.history.pushState(null, "/harvsts/new", location);
        }.bind(this));
      }
    },

    render: function() {
      return(
        <div className="input-group pad-top">
          <input
            type="text"
            className="form-control"
            placeholder="search or add by address"
            aria-describedby="search-addon"
            onChange={this._handleChange} />
          <span
            className="input-group-addon"
            id="search-addon"
            onClick={this._handleSearch} >
            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
          </span>
          <span
            className="input-group-addon"
            alt="Add Harvest"
            onClick={this._handleAddClick}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
          </span>
        </div>
      );
    }
  });

}(this));
