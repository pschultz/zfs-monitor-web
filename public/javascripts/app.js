
define(['zpool/model', 'zpool/view', 'scan/model', 'scan/collection', 'disk/model', 'disk/view', 'disk/collection', 'zfs/model', 'zfs/view', 'zfs/collection', 'diskarray/model', 'diskarray/collection', 'socket-io'], function(ZPool, ZPoolView, Scan, ScanCollection, Disk, DiskView, DiskCollection, Zfs, ZfsView, ZfsCollection, DiskArray, DiskArrayCollection, socket) {
  var giga, kilo, mega, tera;
  kilo = 1024;
  mega = kilo * 1024;
  giga = mega * 1024;
  tera = giga * 1024;
  window.humanReadableBytes = function(bytes) {
    var size, suffix, suffixes;
    suffixes = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    suffix = '';
    size = bytes;
    while (size > 1024 && suffixes.length) {
      size /= 1024.0;
      suffix = suffixes.shift();
    }
    size = Math.round(size * 100) / 100;
    return "" + size + " " + suffix + "B";
  };
  socket.on('*', function(event, data) {
    return console.log(arguments);
  });
  socket.emit('snapshot');
  return socket.on('snapshot', function(snapshot) {
    var arrayData, d, disk, diskData, diskarray, disks, nil, poolData, r, scan, scanData, specialDisks, type, zfs, zfsData, zpool, zpoolView, _i, _j, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4, _ref5;
    if (!((snapshot.zpools != null) && snapshot.zpools.length)) return;
    poolData = snapshot.zpools[1];
    console.log(poolData);
    window.zpool = zpool = ZPool.prototype.createFromMonitorData(poolData);
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
    for (r = 0, _len3 = _ref3.length; r < _len3; r++) {
      arrayData = _ref3[r];
      disks = null;
      type = arrayData.type;
      specialDisks = /^(log|spare|cache)/;
      if (specialDisks.test(type)) {
        _ref4 = specialDisks.exec(type), nil = _ref4[0], type = _ref4[1];
        disks = zpool.get("" + type + "Disks");
      } else {
        type = '';
        diskarray = DiskArray.prototype.createFromMonitorData(arrayData);
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
    zpoolView = new ZPoolView({
      model: zpool,
      el: $("#pool")
    });
    zpoolView.render();
    return setTimeout(function() {
      return $(window).trigger('resize');
    }, 20);
  });
});
