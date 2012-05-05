var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var Router;
  Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      this._rotate = __bind(this._rotate, this);
      this.pool = __bind(this.pool, this);
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.initialize = function() {
      this.view = null;
      this.pools = [];
      return this.interval = setInterval(this._rotate, 5000);
    };

    Router.prototype.routes = {
      'pool/:pool': 'pool',
      'pool': 'pool'
    };

    Router.prototype.pool = function(name) {
      var self;
      if (name == null) name = '';
      if (!name.length && !this.interval) {
        this.interval = setInterval(this._rotate, 5000);
        return;
      }
      self = this;
      return _.each(this.pools, function(view) {
        if (view.model.get('name') !== name) return;
        self._render(view);
        clearInterval(self.interval);
        return self.interval = 0;
      });
    };

    Router.prototype._rotate = function() {
      if (!this.pools.length) return;
      this._render(this.pools.shift());
      return this.pools.push(this.view);
    };

    Router.prototype._render = function(view) {
      if (this.view != null) $(this.view.el).detach();
      this.view = view;
      return $("#root").html(this.view.render());
    };

    return Router;

  })(Backbone.Router);
  return Router;
});
