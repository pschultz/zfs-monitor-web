var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['socket-io'], function(socket) {
  var ScanModel;
  ScanModel = (function(_super) {

    __extends(ScanModel, _super);

    function ScanModel() {
      ScanModel.__super__.constructor.apply(this, arguments);
    }

    ScanModel.prototype.createFromMonitorData = function(poolData) {
      var data;
      data = ScanModel.prototype.convertMonitorData(poolData);
      return new ScanModel(data);
    };

    ScanModel.prototype.convertMonitorData = function(poolData) {
      return {
        id: poolData.id,
        type: poolData.type,
        eta: poolData.eta,
        progress: poolData.progress
      };
    };

    ScanModel.prototype.initialize = function() {
      var self;
      ScanModel.__super__.initialize.call(this);
      self = this;
      return socket.on("scan:" + this.id + ":change", function(data) {
        return self.set(ScanModel.prototype.convertMonitorData(data));
      });
    };

    return ScanModel;

  })(Backbone.Model);
  return ScanModel;
});
