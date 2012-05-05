
define(['zpool/model', 'zpool/view', 'socket-io'], function(ZPool, ZPoolView, socket) {
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
    var i, poolData, zpool, zpoolView, _len, _ref, _results;
    if (!((snapshot.zpools != null) && snapshot.zpools.length)) return;
    _ref = snapshot.zpools;
    _results = [];
    for (i = 0, _len = _ref.length; i < _len; i++) {
      poolData = _ref[i];
      console.log(poolData);
      window.zpool = zpool = ZPool.prototype.createFromMonitorData(poolData);
      zpoolView = new ZPoolView({
        model: zpool,
        "class": $("pool")
      });
      if (i === 1) {
        _results.push($("#root").html(zpoolView.render()));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });
});
