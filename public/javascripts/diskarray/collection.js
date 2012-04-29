(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['diskarray/model'], function(DiskArray) {
    var DiskArrayCollection;
    DiskArrayCollection = (function(_super) {

      __extends(DiskArrayCollection, _super);

      function DiskArrayCollection() {
        DiskArrayCollection.__super__.constructor.apply(this, arguments);
      }

      DiskArrayCollection.prototype.model = DiskArray;

      return DiskArrayCollection;

    })(Backbone.Collection);
    return DiskArrayCollection;
  });

}).call(this);
