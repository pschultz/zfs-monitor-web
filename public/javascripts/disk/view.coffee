define ->
  class DiskView extends Backbone.View
    initialize: ->
      self = @
      @model.collection.on 'remove', (disk) ->
        self.remove() if disk.cid == self.model.cid

    render: =>
      template = $ "#disk-tmpl"
      data = @model.toJSON()
      data.size = humanReadableBytes data.size
      data.type = data.type || '&nbsp;'
      html = template.tmpl data
      $(@el).html html
      $(@el).addClass @model.get('status')
      @el

  DiskView
