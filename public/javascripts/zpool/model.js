var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['dataset/model', 'diskarray/model', 'diskarray/collection', 'disk/model', 'disk/collection', 'zfs/model', 'zfs/collection', 'scan/model', 'scan/collection'], function(Dataset, Diskarray, DiskarrayCollection, Disk, DiskCollection, Zfs, ZfsCollection, Scan, ScanCollection) {
  var ZPoolModel;
  ZPoolModel = (function(_super) {

    __extends(ZPoolModel, _super);

    function ZPoolModel() {
      ZPoolModel.__super__.constructor.apply(this, arguments);
    }

    ZPoolModel.prototype.createFromMonitorData = function(poolData) {
      var arrayData, d, data, disk, diskData, diskarray, disks, nil, scan, scanData, specialDisks, type, zfs, zfsData, zpool, _i, _j, _k, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4, _ref5;
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
        disks = null;
        type = arrayData.type;
        specialDisks = /^(log|spare|cache)/;
        if (specialDisks.test(type)) {
          _ref4 = specialDisks.exec(type), nil = _ref4[0], type = _ref4[1];
          disks = zpool.get("" + type + "Disks");
        } else {
          type = '';
          diskarray = Diskarray.prototype.createFromMonitorData(arrayData);
          zpool.get('diskArrays').add(diskarray);
          disks = diskarray.get('disks');
        }
        _ref5 = arrayData.disks;
        for (d = 0, _len4 = _ref5.length; d < _len4; d++) {
          diskData = _ref5[d];
          diskData.type = type;
          disk = Disk.prototype.createFromMonitorData(diskData);
          disks.add(disk);
        }
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

    return ZPoolModel;

  })(Dataset);
  return ZPoolModel;
});
