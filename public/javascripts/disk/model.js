var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var DiskModel;
  DiskModel = (function(_super) {

    __extends(DiskModel, _super);

    function DiskModel() {
      DiskModel.__super__.constructor.apply(this, arguments);
    }

    DiskModel.prototype.defaults = {
      status: 'ONLINE'
    };

    return DiskModel;

  })(Backbone.Model);
  return DiskModel;
});
