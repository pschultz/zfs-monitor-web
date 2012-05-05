define ['disk/model', 'disk/collection'], (Disk, DiskCollection) ->
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

  DiskarrayModel
