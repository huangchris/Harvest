(function(root) {

  root.EditUser = React.createClass({
    mixins: [ReactRouter.History, React.addons.LinkedStateMixin],

    getInitialState: function() {
      var user = UserStore.getUser();

      return {
        user: user,
        website_url: "",
        email: "",
        description: "",
        profile_img_url: "",
        errors: []
      };
    },

    componentWillMount: function() {
      MessageStore.addChangeListener(this._addErrors);
      if (this.state.user) {
        this.setState({
          website_url: this.state.user.website_url,
          email: this.state.user.email,
          description: this.state.user.description,
          profile_img_url: this.state.user.profile_img_url
        });
      } else {
        this.history.pushState(null, "user/" + CURRENT_USER);
      }
    },

    componentWillUnmount: function() {
      MessageStore.removeChangeListener(this._addErrors);
    },

    _addErrors: function() {
      this.setState({errors: MessageStore.allErrors()});
    },

    _handleSubmit: function(e) {
      e.preventDefault();

      var params = {
        user: {
          website_url: this.state.website_url,
          email: this.state.email,
          description: this.state.description,
          profile_img_url: this.state.profile_img_url
        }
      };

      ApiUtil.updateUser(this.state.user.id, params ,function() {
        this.history.pushState(null, "user/" + this.state.user.id);
      }.bind(this));
    },

    _handleCancelClick: function(e) {
      e.preventDefault();
      this.history.pushState(null, "user/" + this.state.user.id);
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
          profile_img_url: result[0].url,
        });
      }
    },

    render: function() {
      var user;

      if (this.state.user) {
        user = (
          <div>
            <Errors errors={this.state.errors} />
            <div className="row pad-top">
              <div className="col-sm-5">
                <img src={this.state.profile_img_url} className="img-responsive profile-img"/>
              </div>

                <div className="col-sm-7 relative text-center">
                <h1 className="black-border-bottom text-left">
                  {this.state.user.username}s Profile
                </h1>
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        id="user_website"
                        placeholder="Website URL"
                        className="form-control"
                        valueLink={this.linkState("website_url")} />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        id="user_website"
                        placeholder="Email"
                        className="form-control"
                        valueLink={this.linkState("email")} />
                    </div>

                    <div className="form-group">
                      <textarea
                        id="user_description"
                        className="form-control"
                        rows="8"
                        placeholder="Description"
                        valueLink={this.linkState("description")}></textarea>
                    </div>

                    <button type="button" className="btn btn-default icon-right" onClick={this._openWidget}>
                      <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp; Edit Photo
                    </button>

                    <div className="btn-group" role="group" aria-label="...">
                      <button type="button" className="btn btn-default" onClick={this._handleSubmit}>Update Profile</button>
                      <button type="button" className="btn btn-default" onClick={this._handleCancelClick}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                      </button>
                    </div>


                </form>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="margin-right">
          {user}
        </div>
      );
    }
  });

}(this));
