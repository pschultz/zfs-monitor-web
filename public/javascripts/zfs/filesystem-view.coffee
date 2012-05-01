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
        id: 'zfs-capacity'
        className: 'widget c2 r2'
      $(@el).append view.render()

    renderZfsDistribution: ->
      view = new ZfsDistributionView
        collection: @model.get 'filesystems'
        model: @model
        id: 'zfs-distribution'
        className: 'widget c2 r2'
      $(@el).append view.render()


  FilesystemView
