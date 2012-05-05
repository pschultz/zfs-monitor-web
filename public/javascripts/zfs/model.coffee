define ['dataset/model'], (Dataset) ->
  class ZfsModel extends Dataset
    createFromMonitorData: (poolData) ->
      data = ZfsModel::convertMonitorData poolData

      return new ZfsModel data

    convertMonitorData: (poolData) ->
      id:   poolData.id
      name: poolData.name
      size: poolData.size

    defaults:
      size: 0
      free: 0
      allocated: 0
      name: 'unnamed'

  ZfsModel

