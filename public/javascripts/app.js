
define(['zpool/model', 'zpool/view', 'router', 'socket-io'], function(ZPool, ZPoolView, Router, socket) {
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
    var i, poolData, router, zpool, zpoolView, _len, _ref;
    if (!((snapshot.zpools != null) && snapshot.zpools.length)) return;
    router = new Router();
    zpoolView = null;
    _ref = snapshot.zpools;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      poolData = _ref[i];
      window.zpool = zpool = ZPool.prototype.createFromMonitorData(poolData);
      zpoolView = new ZPoolView({
        model: zpool,
        "class": $("pool")
      });
      router.pools.push(zpoolView);
    }
    router._rotate();
    return Backbone.history.start();
  });
});
