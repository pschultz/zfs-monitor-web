define ->
  class DiskModel extends Backbone.Model
    createFromMonitorData: (poolData) ->
      data = DiskModel::convertMonitorData poolData

      return new DiskModel data

    convertMonitorData: (poolData) ->
      id:       poolData.id
      status:   poolData.status
      type:     poolData.type
      size:     poolData.size
      deviceId: poolData.name

  DiskModel

