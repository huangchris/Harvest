(function(root) {
  root.ShareButton = React.createClass({
    mixins: [ReactRouter.History],

    _handleUserClick: function(e) {
      e.preventDefault();
      this.history.pushState(null, "user/" + this.props.share.shared_userid);
    },

    _handleDeleteClick: function(e) {
      e.preventDefault();
      ApiUtil.deleteShare(this.props.share);
    },

    render: function() {
      return(
        <div className="btn-group tiny-button-case" role="group" aria-label="...">
          <button type="button"
            className="btn btn-default tiny-button"
            onClick={this._handleUserClick}>
            {this.props.share.shared_username}
          </button>
          <button type="button"
            className="btn btn-default tiny-button"
            onClick={this._handleDeleteClick}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </button>
        </div>
      );
    }
  });
}(this));
