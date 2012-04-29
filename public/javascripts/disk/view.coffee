define ->
  class DiskView extends Backbone.View
    render: =>
      template = $ "#disk-tmpl"
      html = template.tmpl @model.toJSON()
      @el = $(html)
      $(@el).addClass @model.get('status')
      $(@el).attr 'id', @model.cid
      @el

  DiskView
