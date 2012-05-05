define ['zfs/capacity-view', 'zfs/distribution-view'], (ZfsCapacityView, ZfsDistributionView) ->
  class FilesystemView extends Backbone.View
    render: =>
      template = $ "#filesystems-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

      @renderZfsCapacity()
      @renderZfsDistribution()

      @el

    renderZfsCapacity: ->
      view = new ZfsCapacityView
        model: @model
        className: 'zfs-capacity widget c2 r2'
      $(@el).append view.render()

    renderZfsDistribution: ->
      view = new ZfsDistributionView
        collection: @model.get 'filesystems'
        model: @model
        className: 'zfs-distribution widget c2 r2'
      $(@el).append view.render()


  FilesystemView
