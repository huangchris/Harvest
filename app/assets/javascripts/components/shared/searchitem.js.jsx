(function(root) {
  root.SearchItem = React.createClass({
    _handleClick: function(e) {
      e.preventDefault();
      this.props.history.pushState(null, "user/" + this.props.user.id);
    },

    render: function() {
      return(
        <a href="#" onClick={this._handleClick}>{this.props.user}</a>
      )
    }

  })
}(this));
