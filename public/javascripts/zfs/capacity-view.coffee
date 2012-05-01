define ->
  class ZfsView extends Backbone.View
    initialize: ->
      @model.on 'change:free change:allocated change:size', @render

    render: =>
      template = $ "#zfs-capacity-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html
      @el

  ZfsView
