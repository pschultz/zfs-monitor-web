define ['zfs/view'], (ZfsView) ->
  class ZfsDistributionView extends Backbone.View
    render: =>
      template = $ "#zfs-distribution-tmpl"
      html = template.tmpl()
      console.log html
      @el = $(html)

      @collection.each @renderZfs
      @el

    renderZfs: (zfs) =>
      console.log zfs
      view = new ZfsView
        model: zfs
      $(@el).find(".content").append view.render()


  ZfsDistributionView
