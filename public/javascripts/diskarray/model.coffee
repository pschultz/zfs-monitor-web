define ['disk/collection'], (DiskCollection) ->
  class DiskArrayModel extends Backbone.Model
    defaults:
      type: 'raidz'
      name: 'raidz-0'
      disks: null

  DiskArrayModel
