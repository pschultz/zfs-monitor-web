define ['zpool/caption-view', 'diskarray/view', 'zfs/filesystem-view'], (ZPoolCaptionView, DiskArrayView, FilesystemView) ->
  class ZPoolView extends Backbone.View
    initialize: ->
      return unless @model

      @model.get('diskArrays').on 'add', @renderDiskArray

    render: =>
      template = $ "#zpool-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

      @renderCaption()
      @model.get('diskArrays').each @renderDiskArray
      @renderFilesystems()

      @el

    renderCaption: =>
      captionView = new ZPoolCaptionView
        model: @model
        id: 'pool-caption'
        className: 'widget head r1'
      $(@el).prepend captionView.render()

    renderDiskArray: (diskArray) =>
      view = new DiskArrayView
        model: diskArray
        tagName: 'div'
        id: @model.cid
        className: 'diskarray widget c1 r1'

      @$(".diskarrays").append view.render()

    renderFilesystems: =>
      view = new FilesystemView
        model: @model
        className: 'filesystems widget-container pull'

      $(@el).append view.render()


  ZPoolView
