define ->
  class ScanModel extends Backbone.Model
    createFromMonitorData: (poolData) ->
      data = ScanModel::convertMonitorData poolData

      return new ScanModel data

    convertMonitorData: (poolData) ->
      id:       poolData.id
      type:     poolData.type
      eta:      poolData.eta
      progress: poolData.progress

  ScanModel
