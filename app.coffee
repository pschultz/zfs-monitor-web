express = require('express')
routes = require('./routes')

app = module.exports = express.createServer()
io = require('socket.io').listen(app)

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

query = new (require './modules/zpool-query')

query.on 'analyzed', (analysis) ->
  console.log p for p in analysis.pools

query.start()

###
query.on 'analyzed', (zpools) ->
  io.broadcast update: zpools

clients = {}

io.sockets.on 'connection', (socket) ->
  clients[socket.id] = socket
  query.keepItComin()

  socket.on 'disconnect', ->
    delete clients[this.id]
    query.slowDown() if not Object.keys(clients).length
###

