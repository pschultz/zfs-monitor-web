define ['zpool/caption-view', 'diskarray/view', 'scan/view', 'zfs/filesystem-view'], (ZPoolCaptionView, DiskArrayView, ScanView, FilesystemView) ->
  class ZPoolView extends Backbone.View
    initialize: ->
      return unless @model

      @model.get('diskArrays').on 'add', @renderDiskArray

    render: =>
      template = $ "#zpool-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

      @renderCaption()
      @renderScans()
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

    renderScans: =>
      view = new ScanView
        model: @model
        collection: @model.get 'scans'
        className: 'scans widget head r2'

      $(@el).append view.render()

    renderFilesystems: =>
      view = new FilesystemView
        model: @model
        className: 'filesystems widget-container'

      $(@el).append view.render()


  ZPoolView
