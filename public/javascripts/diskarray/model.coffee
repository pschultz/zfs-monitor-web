define ['disk/collection'], (DiskCollection) ->
  class DiskarrayModel extends Backbone.Model
    createFromMonitorData: (poolData) ->
      data = DiskarrayModel::convertMonitorData poolData
      data.disks = new DiskCollection()

      return new DiskarrayModel data

    convertMonitorData: (poolData) ->
      id:     poolData.id
      name:   poolData.name
      type:   poolData.type
      status: poolData.status

  DiskarrayModel
