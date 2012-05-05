define [
  'dataset/model',
  'diskarray/model', 'diskarray/collection',
  'disk/model', 'disk/collection',
  'zfs/model', 'zfs/collection',
  'scan/model', 'scan/collection'], (Dataset, Diskarray, DiskarrayCollection, Disk, DiskCollection, Zfs, ZfsCollection, Scan, ScanCollection) ->
  class ZPoolModel extends Dataset
    createFromMonitorData: (poolData) ->
      data = ZPoolModel::convertMonitorData poolData
      data.diskArrays  = new DiskarrayCollection()
      data.spareDisks  = new DiskCollection()
      data.logDisks    = new DiskCollection()
      data.cacheDisks  = new DiskCollection()
      data.filesystems = new ZfsCollection()
      data.scans       = new ScanCollection()

      zpool = new ZPoolModel data

      for zfsData in poolData.filesystems
        zfs = Zfs::createFromMonitorData zfsData
        zpool.get('filesystems').add zfs

      for scanData in poolData.scans
        scan = Scan::createFromMonitorData scanData
        zpool.get('scans').add scan

      for arrayData in poolData.diskArrays
        disks = null
        type = arrayData.type

        specialDisks = /^(log|spare|cache)/

        if specialDisks.test type
          [ nil, type ] = specialDisks.exec type
          disks = zpool.get "#{type}Disks"
        else
          type = ''
          diskarray = Diskarray::createFromMonitorData arrayData
          zpool.get('diskArrays').add diskarray
          disks = diskarray.get 'disks'

        for diskData, d in arrayData.disks
          diskData.type = type
          disk = Disk::createFromMonitorData diskData
          disks.add disk

      zpool

    convertMonitorData: (poolData) ->
      id:        poolData.id
      name:      poolData.name
      status:    poolData.status
      size:      poolData.size
      allocated: poolData.allocated

    statusList: [
      'ONLINE' , 'OFFLINE'
      'AVAIL'  , 'UNAVAIL'
      'FAULTED', 'DEGRADED'
    ]

  ZPoolModel
