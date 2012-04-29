define ->
  class ZfsView extends Backbone.View
    render: =>
      template = $ "#zfs-capacity-tmpl"
      html = template.tmpl @model.toJSON()
      @el = $(html)
      $(@el).attr 'id', @model.cid
      @el

  ZfsView
