var Monitor, app, clients, express, io, routes;

express = require('express');

routes = require('./routes');

app = module.exports = express.createServer();

io = require('socket.io').listen(app);

io.set('log level', 1);

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  return app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  return app.set('view options', {
    pretty: true
  });
});

app.configure('production', function() {
  return app.use(express.errorHandler());
});

app.get('/', routes.index);

app.listen(3000, function() {
  return console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

Monitor = require('zfs-monitor');

clients = {};

io.sockets.on('connection', function(socket) {
  clients[socket.id] = socket;
  Monitor.on('*', function() {
    socket.emit('*', arguments[0], arguments[1]);
    return socket.emit(arguments[0], arguments[1]);
  });
  Monitor.startMonitoring();
  return socket.on('disconnect', function() {
    delete clients[this.id];
    if (!Object.keys(clients).length) return Monitor.stopMonitoring();
  });
});
