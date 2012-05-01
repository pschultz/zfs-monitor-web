var app, express, io, query, routes;

express = require('express');

routes = require('./routes');

app = module.exports = express.createServer();

io = require('socket.io').listen(app);

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

query = new (require('./modules/zpool-query'));

query.on('analyzed', function(analysis) {
  var p, _i, _len, _ref, _results;
  _ref = analysis.pools;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    p = _ref[_i];
    _results.push(console.log(p));
  }
  return _results;
});

query.start();

/*
query.on 'analyzed', (zpools) ->
  io.broadcast update: zpools

clients = {}

io.sockets.on 'connection', (socket) ->
  clients[socket.id] = socket
  query.keepItComin()

  socket.on 'disconnect', ->
    delete clients[this.id]
    query.slowDown() if not Object.keys(clients).length
*/
