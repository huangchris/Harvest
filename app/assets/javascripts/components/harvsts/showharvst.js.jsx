(function(root) {

  root.ShowHarvst = React.createClass({

    getInitialState: function() {
      return {harvst: null, errors: []};
    },

    _updateErrors: function() {
      this.setState({errors: MessageStore.allErrors()});
    },

    componentWillMount: function() {
      HarvstStore.addChangeListener(this._updateHarvst);
      MessageStore.addChangeListener(this._updateErrors);
    },

    componentWillUnmount: function() {
      HarvstStore.removeChangeListener(this._updateHarvst);
      MessageStore.removeChangeListener(this._updateErrors);
    },

    _updateHarvst: function() {
      this.setState({harvst: HarvstStore.getHarvst()});
    },

    handleDeleteClick: function(e) {
      e.preventDefault();
      if(root.confirm("Are you sure you want to delete this harvest?")) {
        ApiUtil.deleteHarvst(this.state.harvst.id, function() {
          this.props.history.pushState("", "");
        }.bind(this));
      }
    },


    handleEditClick: function(e) {
      e.preventDefault();
      this.props.history.pushState("", this.state.harvst.id + "/edit");
    },

    _handleUserClick: function(e) {
      e.preventDefault();
      this.props.history.pushState("", "user/" + this.state.harvst.user.id);
    },

    render: function() {
      var harvstShowContents, shareForm, editDeleteButton;

      if (this.state.harvst) {
        if (this.state.harvst.user.id === CURRENT_USER) {
          shareForm = (
            <ShareForm harvst={this.state.harvst}/>
            );

          editDeleteButton = (
            <span className="float-right">
              <div className="btn-group" >
                <button type="button" className="btn btn-default" onClick={this.handleEditClick}>
                  <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </button>
                <button type="button" className="btn btn-default" onClick={this.handleDeleteClick}>
                  <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button>
              </div>
            </span>
          );

        }

        harvstShowContents = (
          <div className="show-view-body text-left">
            <Errors errors={this.state.errors} />
            {shareForm}
            <h1 className="text-left">
              {this.state.harvst.title}
              {editDeleteButton}
            </h1>
            <p className="black-border-bottom cf">
              <span className="float-left">
                Posted by <a href="#" onClick={this._handleUserClick} >{this.state.harvst.user.username}</a> {this.state.harvst.created_at} ago.
              </span>
              <span className="float-right">
                {this.state.harvst.privacy}
              </span>
            </p>
            <img src={this.state.harvst.image_url} className="img-responsive"/>
            <div className="black-border-top">
              {this.state.harvst.address} &nbsp;|&nbsp; {this.state.harvst.contact}
            </div>
            <div className="row small-margin-bottom margin-top">
              <div className="col-xs-10 wrap-text">{this.state.harvst.description}<br /></div>
              <div className="col-xs-2 text-right"><b>Details</b></div>
            </div>

            <HarvstComments harvst={this.state.harvst}  history={this.props.history} />
          </div>
        );

      }

      return(
        <div className="col-md-5 col-md-offset-7 pad-right">
          {harvstShowContents}
        </div>
      );
    }
  });

}(this));
