define ['zpool/caption-view', 'diskarray/view', 'iostats/view', 'scan/view', 'zfs/filesystem-view', 'empty-widget-view'], (ZPoolCaptionView, DiskarrayView, IostatsView, ScanView, FilesystemView, EmptyWidgetView) ->
  class ZPoolView extends Backbone.View
    initialize: ->
      return unless @model

      @model.get('diskArrays').on 'add', @renderDiskarray

    render: =>
      template = $ "#zpool-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

      @renderCaption()
      @renderTail() for i in [1..4]
      @model.get('diskArrays').each @renderDiskarray
      @renderScans()
      @renderFilesystems()
      
      # this fixes layouting and sizing problems with highcharts
      # that occur when charts are rendered to elements that have
      # not yet been attached to the dom

      setTimeout ->
        $(window).trigger('resize')
      , 20

      @el

    renderCaption: =>
      captionView = new ZPoolCaptionView
        model: @model
        className: 'pool-caption widget head r1'
      $(@el).prepend captionView.render()

    renderDiskarray: (diskarray) =>
      return if diskarray.isSpecialArray()
      view = new DiskarrayView
        model: diskarray
        tagName: 'div'
        id: diskarray.cid
        className: 'diskarray widget c1 r1'

      @$(".empty.widget").first().before view.render()
      @$(".empty.widget").last().remove()

    renderTail: =>
      view = new EmptyWidgetView
        className: 'empty widget c1 r1'

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
