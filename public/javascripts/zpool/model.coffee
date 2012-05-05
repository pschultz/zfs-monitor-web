define ['dataset/model', 'diskarray/collection'], (Dataset, DiskArrayCollection) ->
  class ZPoolModel extends Dataset
    defaults:
      name:       'unnamed'
      size:       0
      free:       0
      allocated:  0
      diskArrays: null
      logDisks:   null
      spareDisks: null
      cacheDisks: null
      scans:      null

    statusList: [
      'ONLINE' , 'OFFLINE'
      'AVAIL'  , 'UNAVAIL'
      'FAULTED', 'DEGRADED'
    ]

  ZPoolModel
