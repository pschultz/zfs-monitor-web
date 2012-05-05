define [
  'zpool/model', 'zpool/view',
  'scan/model', 'scan/collection'
  'disk/model', 'disk/view', 'disk/collection'
  'zfs/model', 'zfs/view', 'zfs/collection'
  'diskarray/model', 'diskarray/collection'
], (ZPool, ZPoolView, Scan, ScanCollection, Disk, DiskView, DiskCollection, Zfs, ZfsView, ZfsCollection, DiskArray, DiskArrayCollection) ->
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

  diskSizes = []
  poolSize = 0
  for r in [0..3]
    diskSizes[r] = []
    arraySize = Infinity
    for d in [0..3]
      size = (Math.random() * .5 + 1.5) * tera
      diskSizes[r][d] = size
      arraySize = Math.min(arraySize, size)
    poolSize += arraySize * 3


  window.zpool = zpool = new ZPool
    diskArrays:  new DiskArrayCollection()
    spareDisks:  new DiskCollection()
    logDisks:    new DiskCollection()
    cacheDisks:  new DiskCollection()
    filesystems: new ZfsCollection()
    scans:       new ScanCollection()
    status: 'ONLINE'

  zpoolView = new ZPoolView
    model: zpool
    el: $("#pool")

  zpoolView.render()

  zpool.set
    name: 'tank'
    status: 'ONLINE'
    size:      poolSize
    allocated: poolSize * Math.random()

  for r in [0..3]
    disks = new DiskCollection()
    zpool.get('diskArrays').add new DiskArray
      name: "raidz-#{r}"
      disks: disks

    for d in [0..3]
      disks.add new Disk
        deviceId: "c#{r}d#{d}"
        size: diskSizes[r][d]

  fsList = [
    'tank'
    'tank/exports'
    'tank/exports/Audio'
    'tank/exports/Audio/Books'
    'tank/exports/Audio/Music'
    'tank/exports/Downloads'
    'tank/exports/Games'
    'tank/exports/Video'
    'tank/exports/Video/Movies'
    'tank/exports/Video/TvShows'
    'tank/exports/pxe'
    'tank/homes'
    'tank/homes/knox'
    'tank/homes/knox.old'
    'tank/homes/pschultz'
    'tank/homes/xbmc'
  ]

  remainingPoolSize = poolSize

  for fs in _.shuffle(fsList)
    zfsSize = remainingPoolSize / (Math.random() * 5 + 3)
    remainingPoolSize -= zfsSize
    zpool.get('filesystems').add new Zfs
      name: fs
      size: zfsSize

  zpool.get('logDisks').add new Disk
    size: 120 * giga
    type: 'log'
    status: 'ONLINE'
    deviceId: 'c5d1'

  zpool.get('spareDisks').add new Disk
    size: 1500 * giga
    type: 'spare'
    status: 'ONLINE'
    deviceId: 'c5d0'

  zpool.get('spareDisks').add new Disk
    size: 1800 * giga
    type: 'spare'
    status: 'ONLINE'
    deviceId: 'c6d0'

  zpool.get('scans').add new Scan
    type: 'scrub'
    eta: 182
    progress: .99

  socket = io.connect '/'
  socket.on '*', (event, data) ->
    console.log arguments
