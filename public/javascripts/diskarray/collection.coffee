define ['diskarray/model'], (DiskArray) ->
  class DiskArrayCollection extends Backbone.Collection
    model: DiskArray

  DiskArrayCollection
