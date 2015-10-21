(function(root) {
  root.Notifications = React.createClass({

    getInitialState: function() {
      return {notifications: [], notificationCount: 0};
    },

    componentWillMount: function() {
      ApiUtil.fetchNotifications();
      NotificationStore.addChangeListener(this._updateNotifications);
    },

    componentWillUnmount: function() {
      NotificationStore.removeChangeListener(this._updateNotifications);
    },

    _updateNotifications: function() {
      this.setState({
        notifications: NotificationStore.all(),
        notificationCount: this.notificationCount()
      });
    },

    _viewNotifications: function() {
      ApiUtil.viewNotifications();
    },

    notificationCount: function() {
      var unviewedNotifications = 0;
      NotificationStore.all().forEach(function(notification) {
        if (notification.viewed === false) {
          unviewedNotifications += 1;
        }
      });

      return unviewedNotifications;
    },

    render: function() {
      var notifications;
      if (this.state.notifications.length > 0) {
        notifications = this.state.notifications.map(function(notification) {
          return (
            <NotificationItem
              history={this.props.history}
              notification={notification}
              key={notification.id}/>
          );
        }.bind(this));
      } else {
        notifications = "You have no notifications.";
      }

      return(
        <li className="dropdown" onClick={this._viewNotifications}>
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
            aria-haspopup="true" aria-expanded="false">
            {this.notificationCount()} Notifications
          </a>
          <ul className="dropdown-menu">
            {notifications}
          </ul>
        </li>
      );
    }
  });
}(this));