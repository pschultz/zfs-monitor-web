var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['disk/model', 'disk/collection'], function(Disk, DiskCollection) {
  var DiskarrayModel;
  DiskarrayModel = (function(_super) {

    __extends(DiskarrayModel, _super);

    function DiskarrayModel() {
      DiskarrayModel.__super__.constructor.apply(this, arguments);
    }

    DiskarrayModel.prototype.specialDiskPattern = /^(log|spare|cache)/;

    DiskarrayModel.prototype.createFromMonitorData = function(poolData) {
      var data, disk, diskData, diskarray, _i, _len, _ref;
      data = DiskarrayModel.prototype.convertMonitorData(poolData);
      data.disks = new DiskCollection();
      diskarray = new DiskarrayModel(data);
      _ref = poolData.disks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        diskData = _ref[_i];
        diskData.type = poolData.type;
        disk = Disk.prototype.createFromMonitorData(diskData);
        diskarray.get('disks').add(disk);
      }
      return diskarray;
    };

    DiskarrayModel.prototype.convertMonitorData = function(poolData) {
      return {
        id: poolData.id,
        name: poolData.name,
        type: poolData.type,
        status: poolData.status
      };
    };

    DiskarrayModel.prototype.isSpecialArray = function() {
      return this.specialDiskPattern.test(this.get('type'));
    };

    return DiskarrayModel;

  })(Backbone.Model);
  return DiskarrayModel;
});
