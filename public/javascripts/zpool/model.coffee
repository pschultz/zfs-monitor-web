define ['dataset/model', 'diskarray/collection', 'disk/collection', 'zfs/collection', 'scan/collection'], (Dataset, DiskArrayCollection, DiskCollection, ZfsCollection, ScanCollection) ->
  class ZPoolModel extends Dataset
    createFromMonitorData: (poolData) ->
      data = ZPoolModel::convertMonitorData poolData
      data.diskArrays  = new DiskArrayCollection()
      data.spareDisks  = new DiskCollection()
      data.logDisks    = new DiskCollection()
      data.cacheDisks  = new DiskCollection()
      data.filesystems = new ZfsCollection()
      data.scans       = new ScanCollection()

      return new ZPoolModel data

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
