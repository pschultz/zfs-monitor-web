(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['zpool/model'], function(ZPool) {
    var ZPoolCollection;
    ZPoolCollection = (function(_super) {

      __extends(ZPoolCollection, _super);

      function ZPoolCollection() {
        ZPoolCollection.__super__.constructor.apply(this, arguments);
      }

      ZPoolCollection.prototype.model = ZPool;

      return ZPoolCollection;

    })(Backbone.Collection);
    return ZPoolCollection;
  });

}).call(this);
