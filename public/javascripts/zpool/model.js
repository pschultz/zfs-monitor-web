var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['socket-io', 'dataset/model', 'diskarray/model', 'diskarray/collection', 'disk/model', 'disk/collection', 'zfs/model', 'zfs/collection', 'scan/model', 'scan/collection'], function(socket, Dataset, Diskarray, DiskarrayCollection, Disk, DiskCollection, Zfs, ZfsCollection, Scan, ScanCollection) {
  var ZPoolModel;
  ZPoolModel = (function(_super) {

    __extends(ZPoolModel, _super);

    function ZPoolModel() {
      ZPoolModel.__super__.constructor.apply(this, arguments);
    }

    ZPoolModel.prototype.createFromMonitorData = function(poolData) {
      var arrayData, data, diskarray, scan, scanData, zfs, zfsData, zpool, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      data = ZPoolModel.prototype.convertMonitorData(poolData);
      data.diskArrays = new DiskarrayCollection();
      data.spareDisks = new DiskCollection();
      data.logDisks = new DiskCollection();
      data.cacheDisks = new DiskCollection();
      data.filesystems = new ZfsCollection();
      data.scans = new ScanCollection();
      zpool = new ZPoolModel(data);
      _ref = poolData.filesystems;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        zfsData = _ref[_i];
        zfs = Zfs.prototype.createFromMonitorData(zfsData);
        zpool.get('filesystems').add(zfs);
      }
      _ref2 = poolData.scans;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        scanData = _ref2[_j];
        scan = Scan.prototype.createFromMonitorData(scanData);
        zpool.get('scans').add(scan);
      }
      _ref3 = poolData.diskArrays;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        arrayData = _ref3[_k];
        diskarray = Diskarray.prototype.createFromMonitorData(arrayData);
        zpool.get('diskArrays').add(diskarray);
      }
      return zpool;
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

    ZPoolModel.prototype.initialize = function() {
      var self;
      ZPoolModel.__super__.initialize.call(this);
      self = this;
      socket.on("pool:" + this.id + ":change", function(data) {
        return self.set(ZPoolModel.prototype.convertMonitorData(data));
      });
      socket.on("pool:" + this.id + ":zfs:*:removed", function(zfs) {
        return self.removeFromCollection(zfs, 'filesystems');
      });
      socket.on("pool:" + this.id + ":scan:*:removed", function(scan) {
        return self.removeFromCollection(scan, 'scans');
      });
      socket.on("pool:" + this.id + ":zfs:*:added", function(zfs) {
        return self.addToCollection(zfs, Zfs, 'filesystems');
      });
      return socket.on("pool:" + this.id + ":scan:*:added", function(scan) {
        return self.addToCollection(scan, Scan, 'scans');
      });
    };

    ZPoolModel.prototype.addToCollection = function(model, klass, attribute) {
      var collection;
      collection = this.get(attribute);
      return collection.add(klass.prototype.createFromMonitorData(model));
    };

    ZPoolModel.prototype.removeFromCollection = function(model, attribute) {
      var collection;
      collection = self.get(attribute);
      model = collection.get(model.id);
      if (model != null) return collection.remove(model);
    };

    return ZPoolModel;

  })(Dataset);
  return ZPoolModel;
});
