var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['disk/collection'], function(DiskCollection) {
  var DiskarrayModel;
  DiskarrayModel = (function(_super) {

    __extends(DiskarrayModel, _super);

    function DiskarrayModel() {
      DiskarrayModel.__super__.constructor.apply(this, arguments);
    }

    DiskarrayModel.prototype.createFromMonitorData = function(poolData) {
      var data;
      data = DiskarrayModel.prototype.convertMonitorData(poolData);
      data.disks = new DiskCollection();
      return new DiskarrayModel(data);
    };

    DiskarrayModel.prototype.convertMonitorData = function(poolData) {
      return {
        id: poolData.id,
        name: poolData.name,
        type: poolData.type,
        status: poolData.status
      };
    };

    return DiskarrayModel;

  })(Backbone.Model);
  return DiskarrayModel;
});
