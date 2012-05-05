define [ 'zpool/model', 'zpool/view', 'router', 'socket-io' ], (ZPool, ZPoolView, Router, socket) ->
  kilo =        1024
  mega = kilo * 1024
  giga = mega * 1024
  tera = giga * 1024

  window.humanReadableBytes = (bytes) ->
    suffixes = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
    suffix = ''
    size = bytes
    while size > 1024 && suffixes.length
      size /= 1024.0
      suffix = suffixes.shift()

    size = Math.round(size * 100) / 100
    "#{size} #{suffix}B"

  socket.emit 'snapshot'
  socket.once 'snapshot', (snapshot) ->
    return unless snapshot.zpools? && snapshot.zpools.length

    router = new Router()
    zpoolView = null

    for poolData, i in snapshot.zpools
      window.zpool = zpool = ZPool::createFromMonitorData poolData

      zpoolView = new ZPoolView
        model: zpool
        class: $("pool")

      router.pools.push zpoolView

    router._rotate()
    Backbone.history.start()
