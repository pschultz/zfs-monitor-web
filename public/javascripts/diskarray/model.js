var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['socket-io', 'disk/model', 'disk/collection'], function(socket, Disk, DiskCollection) {
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

    DiskarrayModel.prototype.initialize = function() {
      var self;
      DiskarrayModel.__super__.initialize.call(this);
      self = this;
      socket.on("diskarray:" + this.id + ":change", function(data) {
        return self.set(DiskarrayModel.prototype.convertMonitorData(data));
      });
      socket.on("diskarray:" + this.id + ":disk:*:removed", function(disk) {
        return self.removeFromCollection(disk, 'disks');
      });
      return socket.on("diskarray:" + this.id + ":disk:*:added", function(disk) {
        return self.addToCollection(disk, 'disks', Disk);
      });
    };

    DiskarrayModel.prototype.addToCollection = function(model, attribute, klass) {
      var collection;
      collection = this.get(attribute);
      return collection.add(klass.prototype.createFromMonitorData(model));
    };

    DiskarrayModel.prototype.removeFromCollection = function(model, attribute) {
      var collection;
      collection = this.get(attribute);
      model = collection.get(model.id);
      if (model != null) return collection.remove(model);
    };

    return DiskarrayModel;

  })(Backbone.Model);
  return DiskarrayModel;
});
