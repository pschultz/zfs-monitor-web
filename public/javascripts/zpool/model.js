var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['dataset/model', 'diskarray/collection', 'disk/collection', 'zfs/collection', 'scan/collection'], function(Dataset, DiskArrayCollection, DiskCollection, ZfsCollection, ScanCollection) {
  var ZPoolModel;
  ZPoolModel = (function(_super) {

    __extends(ZPoolModel, _super);

    function ZPoolModel() {
      ZPoolModel.__super__.constructor.apply(this, arguments);
    }

    ZPoolModel.prototype.createFromMonitorData = function(poolData) {
      var data;
      data = ZPoolModel.prototype.convertMonitorData(poolData);
      data.diskArrays = new DiskArrayCollection();
      data.spareDisks = new DiskCollection();
      data.logDisks = new DiskCollection();
      data.cacheDisks = new DiskCollection();
      data.filesystems = new ZfsCollection();
      data.scans = new ScanCollection();
      return new ZPoolModel(data);
    };

    ZPoolModel.prototype.convertMonitorData = function(poolData) {
      return {
        id: poolData.id,
        name: poolData.name,
        status: poolData.status,
        size: poolData.size,
        allocated: poolData.allocated
      };
    };

    ZPoolModel.prototype.statusList = ['ONLINE', 'OFFLINE', 'AVAIL', 'UNAVAIL', 'FAULTED', 'DEGRADED'];

    return ZPoolModel;

  })(Dataset);
  return ZPoolModel;
});
