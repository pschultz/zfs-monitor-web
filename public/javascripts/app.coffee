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

    poolData = snapshot.zpools[1]
    console.log poolData

    window.zpool = zpool = ZPool::createFromMonitorData poolData

    for zfsData in poolData.filesystems
      zfs = Zfs::createFromMonitorData zfsData
      zpool.get('filesystems').add zfs

    for scanData in poolData.scans
      scan = Scan::createFromMonitorData scanData
      zpool.get('scans').add scan

    for arrayData, r in poolData.diskArrays
      disks = null
      type = arrayData.type

      specialDisks = /^(log|spare|cache)/

      if specialDisks.test type
        [ nil, type ] = specialDisks.exec type
        disks = zpool.get "#{type}Disks"
      else
        type = ''
        diskarray = DiskArray::createFromMonitorData arrayData
        zpool.get('diskArrays').add diskarray
        disks = diskarray.get 'disks'

      for diskData, d in arrayData.disks
        diskData.type = type
        disk = Disk::createFromMonitorData diskData
        disks.add disk

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
