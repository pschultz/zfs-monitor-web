express = require('express')
routes = require('./routes')

app = module.exports = express.createServer()
io = require('socket.io').listen(app)
io.set('log level', 1)

app.configure ->
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))

app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true
  app.set 'view options', pretty: true

app.configure 'production', ->
  app.use express.errorHandler()

app.get '/', routes.index

app.listen 3000, ->
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)

Monitor = require 'zfs-monitor'

Monitor.on 'monitor:start', -> console.log 'zfs-monitor: starting'
Monitor.on 'monitor:stop' , -> console.log 'zfs-monitor: stopping'

clients = {}

io.sockets.on 'connection', (socket) ->
  clients[socket.id] = socket

  Monitor.on '*', ->
    socket.emit '*', arguments[0], arguments[1]
    socket.emit arguments[0], arguments[1]

  Monitor.startMonitoring()

  socket.on 'snapshot', ->
    send = (snapshot) -> socket.emit 'snapshot', snapshot

    snapshot = Monitor.getSnapshot()

    return send snapshot if snapshot?
    Monitor.once 'complete', send

  socket.on 'disconnect', ->
    delete clients[this.id]
    Monitor.stopMonitoring() if not Object.keys(clients).length
