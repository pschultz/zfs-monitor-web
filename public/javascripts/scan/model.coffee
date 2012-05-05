define [ 'socket-io' ], (socket) ->
  class ScanModel extends Backbone.Model
    createFromMonitorData: (poolData) ->
      data = ScanModel::convertMonitorData poolData

      return new ScanModel data

    convertMonitorData: (poolData) ->
      id:       poolData.id
      type:     poolData.type
      eta:      poolData.eta
      progress: poolData.progress

    initialize: ->
      super()
      self = @

      socket.on "scan:#{@id}:change", (data) ->
        self.set ScanModel::convertMonitorData data

  ScanModel
