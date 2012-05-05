var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['socket-io'], function(socket) {
  var DiskModel;
  DiskModel = (function(_super) {

    __extends(DiskModel, _super);

    function DiskModel() {
      DiskModel.__super__.constructor.apply(this, arguments);
    }

    DiskModel.prototype.createFromMonitorData = function(poolData) {
      var data;
      data = DiskModel.prototype.convertMonitorData(poolData);
      return new DiskModel(data);
    };

    DiskModel.prototype.convertMonitorData = function(poolData) {
      return {
        id: poolData.id,
        status: poolData.status,
        type: poolData.type,
        size: poolData.size,
        deviceId: poolData.name
      };
    };

    DiskModel.prototype.initialize = function() {
      var self;
      DiskModel.__super__.initialize.call(this);
      self = this;
      return socket.on("disk:" + this.id + ":change", function(data) {
        return self.set(DiskModel.prototype.convertMonitorData(data));
      });
    };

    return DiskModel;

  })(Backbone.Model);
  return DiskModel;
});
