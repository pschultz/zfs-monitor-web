define [
  'zpool/model', 'zpool/view',
  'scan/model', 'scan/collection'
  'disk/model', 'disk/view', 'disk/collection'
  'zfs/model', 'zfs/view', 'zfs/collection'
  'diskarray/model', 'diskarray/collection'
  'socket-io'
], (ZPool, ZPoolView, Scan, ScanCollection, Disk, DiskView, DiskCollection, Zfs, ZfsView, ZfsCollection, DiskArray, DiskArrayCollection, socket) ->
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

    poolData = snapshot.zpools[3]
    console.log poolData

    window.zpool = zpool = new ZPool
      id:          poolData.id
      name:        poolData.name
      status:      poolData.status
      size:        poolData.size
      allocated:   poolData.allocated
      diskArrays:  new DiskArrayCollection()
      spareDisks:  new DiskCollection()
      logDisks:    new DiskCollection()
      cacheDisks:  new DiskCollection()
      filesystems: new ZfsCollection()
      scans:       new ScanCollection()

    for zfsData in poolData.filesystems
      zpool.get('filesystems').add new Zfs
        id:   zfsData.id
        name: zfsData.name
        size: zfsData.size

    for scanData in poolData.scans
      zpool.get('scans').add new Scan
        id:       scanData.id
        type:     scanData.type
        eta:      scanData.eta
        progress: scanData.progress

    for arrayData, r in poolData.diskArrays
      disks = null
      type = arrayData.type

      specialDisks = /^(log|spare|cache)/

      if specialDisks.test type
        [ nil, type ] = specialDisks.exec type
        disks = zpool.get "#{type}Disks"
      else
        type = ''
        disks = new DiskCollection()
        zpool.get('diskArrays').add new DiskArray
          id:     arrayData.id
          name:   arrayData.name
          type:   arrayData.type
          status: arrayData.status
          disks:  disks

      for diskData, d in arrayData.disks
        disks.add new Disk
          id:       diskData.id
          status:   diskData.status
          type:     type
          size:     diskData.size
          deviceId: diskData.name

    zpoolView = new ZPoolView
      model: zpool
      el: $("#pool")

    zpoolView.render()

    # this fixes layouting and sizing problems with highcharts
    # that occur when charts are rendered to elements that have
    # not yet been attached to the dom

    setTimeout ->
      $(window).trigger('resize')
    , 20
