define ['diskarray/view', 'zfs/capacity-view', 'zfs/distribution-view'], (DiskArrayView, ZfsCapacityView, ZfsDistributionView) ->
  class ZPoolView extends Backbone.View
    render: =>
      template = $ "#zpool-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html
      @$("h2").addClass @model.get('status')

      diskArrays = @model.get 'diskArrays'

      diskArrays.each @renderDiskArray
      @renderZfsCapacity()
      @renderZfsDistribution()
      @el

    renderDiskArray: (diskArray) =>
      view = new DiskArrayView
        model: diskArray
        el: @$("##{diskArray.cid}")

      @$("#arrays").append view.render()

    renderZfsCapacity: ->
      view = new ZfsCapacityView
        model: @model
      @$("#filesystems").append view.render()

    renderZfsDistribution: ->
      view = new ZfsDistributionView
        collection: @model.get 'filesystems'
      @$("#filesystems").append view.render()


  ZPoolView
