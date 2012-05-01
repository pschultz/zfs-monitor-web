define ->
  class DiskView extends Backbone.View
    initialize: ->
      self = @
      @model.collection.on 'remove', (disk) ->
        self.remove() if disk.cid == self.model.cid

    render: =>
      template = $ "#disk-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html
      $(@el).addClass @model.get('status')
      @el

  DiskView
