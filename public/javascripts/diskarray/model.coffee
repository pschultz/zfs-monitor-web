define ['socket-io', 'disk/model', 'disk/collection'], (socket, Disk, DiskCollection) ->
  class DiskarrayModel extends Backbone.Model
    specialDiskPattern: /^(log|spare|cache)/

    createFromMonitorData: (poolData) ->
      data = DiskarrayModel::convertMonitorData poolData
      data.disks = new DiskCollection()

      diskarray = new DiskarrayModel data

      for diskData in poolData.disks
        diskData.type = poolData.type
        disk = Disk::createFromMonitorData diskData
        diskarray.get('disks').add disk

      diskarray

    convertMonitorData: (poolData) ->
      id:     poolData.id
      name:   poolData.name
      type:   poolData.type
      status: poolData.status

    isSpecialArray: ->
      @specialDiskPattern.test @get('type')

    initialize: ->
      super()
      self = @

      socket.on "diskarray:#{@id}:change", (data) ->
        self.set DiskarrayModel::convertMonitorData data

      socket.on "diskarray:#{@id}:disk:*:removed", (disk) -> self.removeFromCollection disk, 'disks'
      socket.on "diskarray:#{@id}:disk:*:added",   (disk) -> self.addToCollection      disk, 'disks', Disk

    addToCollection: (model, attribute, klass) ->
      collection = @get attribute
      collection.add klass::createFromMonitorData model

    removeFromCollection: (model, attribute) ->
      collection = @get attribute
      model = collection.get(model.id)
      collection.remove model if model?

  DiskarrayModel
