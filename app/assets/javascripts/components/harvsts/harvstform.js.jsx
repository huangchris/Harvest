(function(root) {

  root.HarvstForm = React.createClass({

    blankAttrs: {
      lat: null,
      lng: null,
      title: null,
      description: "Pick up instructions and description",
      address: "",
      privacy: "public",
      end_date: null,
      image_url: null,
      image_thumbnail: null,
      contact: null,
      errors: null
    },

    mixins: [React.addons.LinkedStateMixin, ReactRouter.History],

    getInitialState: function() {
      return this.blankAttrs;
    },

    componentWillMount: function() {
      var lat = this.props.location.query.lat;
      var lng = this.props.location.query.lng;

      LocationUtil.fetchAddress(lat, lng);

      MessageStore.addChangeListener(this._addErrors);
      LocationStore.addChangeListener(this._setAddress);
    },

    _setAddress: function() {
      var address = LocationStore.getAddress();
      this.setState({address: address});
      var address_field = document.getElementById("harvst_address");
      address_field.value = address;
    },

    componentDidMount: function() {
      this._setAddress();
    },

    componentWillUnmount: function() {
      MessageStore.removeChangeListener(this._addErrors);
      LocationStore.removeChangeListener(this._setAddress);
    },

    _addErrors: function() {
      var errors = MessageStore.allErrors();
      this.setState({errors: errors});
    },

    _handleSubmit: function(e) {
      e.preventDefault();
      LocationUtil.fetchCoords(this.state.address, this._submitCallback);
    },

    _submitCallback: function(result) {
      var coords = LocationStore.getCoords();
      var address = LocationStore.getAddress();
      this.setState({
        lat: coords.lat,
        lng: coords.lng,
        address: address});

      var harvst = {};
      Object.keys(this.state).forEach(function(key) {
        harvst[key] = this.state[key];
      }.bind(this));

      ApiUtil.addHarvst(harvst, function(result) {
        this.setState(this.blankAttrs);
        this.history.pushState("", result.id + "/show");
      }.bind(this));
    },

    _handlePrivacyChange: function(privacy) {
      this.setState({privacy: privacy});
    },

    _handleAddressChange: function(e) {
      this.setState({address: e.target.value});
    },

    _openWidget: function(e) {
      e.preventDefault();

      cloudinary.openUploadWidget({
        cloud_name: 'harvst',
        upload_preset:'bmx9ikkh',
        max_file_size: 300000,
        theme: 'minimal'
      },
      this._handleWidgetUpload.bind(this));
    },

    _handleWidgetUpload: function(error, result) {
      if (error) {
        this.setState({errors: ["Image upload failed. Peas try again!"]});
      } else if (result) {
        this.setState({
          image_url: result[0].url,
          image_thumbnail: result[0].thumbnail_url
        });
      }
    },

    render: function() {
      var errors = null;
      if (this.state.errors) {
        errors = <Errors errors={this.state.errors} />;
      }

      var photoText;
      var photo;

      if (this.state.image_url) {
        photoText = "Edit Photo";
        photo = <img src={this.state.image_url} className="img-responsive img-circle" width="150" height="150"/>;
      } else {
        photoText = "Add Photo";
      }


      return(
        <div className="row">
          <ShowMap lat={this.props.location.query.lat} lng={this.props.location.query.lng} />

          <div className="col-md-5 col-md-offset-7 pad-right">
            <div className="text-center margin-bottom margin-top relative">
              {photo}
              <button type="button" className="btn btn-default icon-right" onClick={this._openWidget}>
                <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp; {photoText}
              </button>
            </div>

            <h1 className="pad-top">Add Harvest</h1>
            {errors}
            <form onSubmit={this._handleSubmit}>

              <div className="form-group">
                <input
                  type="text"
                  id="harvst_title"
                  placeholder="Harvest Title"
                  className="form-control"
                  valueLink={this.linkState("title")} />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="harvst_address"
                  placeholder="Address"
                  className="form-control"
                  onChange={this._handleAddressChange} />
              </div>

              <div className="form-group">
                <textarea
                  id="harvst_description"
                  className="form-control"
                  rows="5"
                  valueLink={this.linkState("description")}></textarea>
              </div>


              <div className="form-group">
                <input
                  type="text"
                  id="harvst_contact"
                  className="form-control"
                  placeholder="Contact information (optional)"
                  valueLink={this.linkState("contact")} />
              </div>

              <div className="date-inline form-group">
                <label htmlFor="harvst_end_date">End date (optional)</label>
                <input
                  type="date"
                  className="form-control"
                  id="harvst_end_date"
                  valueLink={this.linkState("end_date")} />
              </div>

              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="harvst_privacy"
                    value="public"
                    id="harvst_privacy_public"
                    defaultChecked
                    onChange={this._handlePrivacyChange.bind(this,'public')} />
                  Public (anyone can view this harvest)
                </label>
              </div>

              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="harvst_privacy"
                    value="private"
                    id="harvst_privacy_private"
                    onChange={this._handlePrivacyChange.bind(this,'private')} />
                  Private (only shared users can view)
                </label>
              </div>

              <br />

              <div className="text-center">
                <button className="btn btn-default">Add Harvest</button>
              </div>
            </form>
          </div>
        </div>
      );
    }

  });

}(this));
