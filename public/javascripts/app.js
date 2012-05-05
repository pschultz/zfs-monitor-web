
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
  socket.emit('snapshot');
  return socket.once('snapshot', function(snapshot) {
    var cyclePool, i, poolData, poolViews, zpool, zpoolView, _len, _ref;
    if (!((snapshot.zpools != null) && snapshot.zpools.length)) return;
    poolViews = [];
    _ref = snapshot.zpools;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      poolData = _ref[i];
      window.zpool = zpool = ZPool.prototype.createFromMonitorData(poolData);
      zpoolView = new ZPoolView({
        model: zpool,
        "class": $("pool")
      });
      poolViews.push(zpoolView);
    }
    cyclePool = function() {
      var v;
      v = poolViews.shift();
      $(v.el).detach();
      poolViews.push(v);
      return $("#root").html(poolViews[0].render());
    };
    cyclePool();
    return setInterval(cyclePool, 5000);
  });
});
