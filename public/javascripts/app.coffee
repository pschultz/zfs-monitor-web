define [ 'zpool/model', 'zpool/view', 'socket-io' ], (ZPool, ZPoolView, socket) ->
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

  socket.on '*', (event, data) ->
    console.log arguments

  socket.emit 'snapshot'

  socket.on 'snapshot', (snapshot) ->
    return unless snapshot.zpools? && snapshot.zpools.length

    poolData = snapshot.zpools[1]
    console.log poolData

    window.zpool = zpool = ZPool::createFromMonitorData poolData

    zpoolView = new ZPoolView
      model: zpool
      el: $("#pool")

    zpoolView.render()
