define [
  'socket-io', 'dataset/model',
  'diskarray/model', 'diskarray/collection',
  'disk/model', 'disk/collection',
  'zfs/model', 'zfs/collection',
  'scan/model', 'scan/collection'], (socket, Dataset, Diskarray, DiskarrayCollection, Disk, DiskCollection, Zfs, ZfsCollection, Scan, ScanCollection) ->
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
        diskarray = Diskarray::createFromMonitorData arrayData
        zpool.get('diskArrays').add diskarray

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

    initialize: ->
      super()
      self = @

      socket.on "pool:#{@id}:change", (data) ->
        self.set ZPoolModel::convertMonitorData data

      socket.on "pool:#{@id}:zfs:*:removed",  (zfs)  -> self.removeFromCollection zfs,  'filesystems'
      socket.on "pool:#{@id}:scan:*:removed", (scan) -> self.removeFromCollection scan, 'scans'

      socket.on "pool:#{@id}:zfs:*:added",  (zfs)  -> self.addToCollection zfs,  Zfs,  'filesystems'
      socket.on "pool:#{@id}:scan:*:added", (scan) -> self.addToCollection scan, Scan, 'scans'

    addToCollection: (model, klass, attribute) ->
      collection = @get attribute
      collection.add klass::createFromMonitorData model

    removeFromCollection: (model, attribute) ->
      collection = self.get attribute
      model = collection.get(model.id)
      collection.remove model if model?


  ZPoolModel
