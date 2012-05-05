
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
    var poolData, zpool, zpoolView;
    if (!((snapshot.zpools != null) && snapshot.zpools.length)) return;
    poolData = snapshot.zpools[1];
    console.log(poolData);
    window.zpool = zpool = ZPool.prototype.createFromMonitorData(poolData);
    zpoolView = new ZPoolView({
      model: zpool,
      el: $("#pool")
    });
    return zpoolView.render();
  });
});
