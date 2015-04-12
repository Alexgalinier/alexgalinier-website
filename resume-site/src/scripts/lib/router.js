//Class
function RouterClass() {
  this.routes = [];
  this.otherwiseRoute = null;
  this.routeChangedCallback = null;
}

RouterClass.prototype.add = function(name, callback) {
  this.routes.push({
    routeName: name,
    routeCallback: callback
  });
}

RouterClass.prototype.otherwise = function(name) {
  this.otherwiseRoute = name;
}

RouterClass.prototype.onRouteChange = function(callback) {
  this.routeChangedCallback = callback;
}

RouterClass.prototype.serveRoute = function(routeToServe) {
  var foundRoute = null,
    aRoute;

  for (var i = 0; i < this.routes.length; i++) {
    aRoute = this.routes[i];

    if (aRoute.routeName === routeToServe) {
      foundRoute = aRoute;
      break;
    }
  }

  if (!foundRoute && this.otherwiseRoute) {
    location.hash = this.otherwiseRoute;
    return;
  }

  if (foundRoute) {
    foundRoute.routeCallback();

    if (this.routeChangedCallback) {
      this.routeChangedCallback();
    }
  }
}

RouterClass.prototype.start = function() {
  window.onhashchange = function() {
    this.serveRoute(location.hash.substr(1));
  }.bind(this);

  this.serveRoute(location.hash.substr(1));
}