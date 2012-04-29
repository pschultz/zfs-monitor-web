(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['zfs/model'], function(Zfs) {
    var ZfsCollection;
    ZfsCollection = (function(_super) {

      __extends(ZfsCollection, _super);

      function ZfsCollection() {
        ZfsCollection.__super__.constructor.apply(this, arguments);
      }

      ZfsCollection.prototype.model = Zfs;

      return ZfsCollection;

    })(Backbone.Collection);
    return ZfsCollection;
  });

}).call(this);
