var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['disk/collection'], function(DiskCollection) {
  var DiskArrayModel;
  DiskArrayModel = (function(_super) {

    __extends(DiskArrayModel, _super);

    function DiskArrayModel() {
      DiskArrayModel.__super__.constructor.apply(this, arguments);
    }

    DiskArrayModel.prototype.defaults = {
      type: 'raidz',
      name: 'raidz-0',
      disks: null
    };

    return DiskArrayModel;

  })(Backbone.Model);
  return DiskArrayModel;
});
