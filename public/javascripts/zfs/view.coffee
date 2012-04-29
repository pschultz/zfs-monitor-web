define ->
  class ZfsView extends Backbone.View
    render: =>
      template = $ "#zfs-tmpl"
      html = template.tmpl @model.toJSON()
      @el = $(html)

  ZfsView
