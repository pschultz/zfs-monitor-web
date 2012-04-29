define [
  'zpool/model', 'zpool/view'
  'disk/model', 'disk/view', 'disk/collection'
  'zfs/model', 'zfs/view', 'zfs/collection'
  'diskarray/model', 'diskarray/collection'
], (ZPool, ZPoolView, Disk, DiskView, DiskCollection, Zfs, ZfsView, ZfsCollection, DiskArray, DiskArrayCollection) ->

  diskArrays = new DiskArrayCollection()
  filesystems = new ZfsCollection()

  for r in [0..3]
    disks = new DiskCollection()
    for d in [0..3]
      disks.add new Disk
        deviceId: "c#{r}d#{d}"

    diskArrays.add new DiskArray
      name: "raidz-#{r}"
      disks: disks

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

  for fs in fsList
    filesystems.add new Zfs
      name: fs

  zpool = new ZPool
    name: 'tank'
    diskArrays: diskArrays
    filesystems: filesystems
    size:      3.0 * 1024 * 1024 * 1024 * 1024
    allocated: 2.1 * 1024 * 1024 * 1024 * 1024
    status: 'ONLINE'

  zpoolView = new ZPoolView
    model: zpool
    el: $("#pool")

  zpoolView.render()
