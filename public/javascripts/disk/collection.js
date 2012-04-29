(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(['disk/model'], function(Disk) {
    var DiskCollection;
    DiskCollection = (function(_super) {

      __extends(DiskCollection, _super);

      function DiskCollection() {
        DiskCollection.__super__.constructor.apply(this, arguments);
      }

      DiskCollection.prototype.model = Disk;

      return DiskCollection;

    })(Backbone.Collection);
    return DiskCollection;
  });

}).call(this);
