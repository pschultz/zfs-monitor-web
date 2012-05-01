define ['zfs/view'], (ZfsView) ->
  class ZfsDistributionView extends Backbone.View
    initialize: ->
      @collection.on 'add remove change', @render

    render: =>
      template = $ "#zfs-distribution-tmpl"
      html = template.tmpl()
      $(@el).html html

      @collection.each @renderZfs
      @el

    renderZfs: (zfs) =>
      view = new ZfsView
        model: zfs
      @$(".content").append view.render()


  ZfsDistributionView
