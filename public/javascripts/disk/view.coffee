define ['zpool/model'], (ZPool) ->
  class DiskView extends Backbone.View
    initialize: ->
      self = @

      @model.on 'change', @render
      @model.collection.on 'remove', (disk) ->
        self.remove() if disk.cid == self.model.cid

    render: =>
      template = $ "#disk-tmpl"
      data = @model.toJSON()
      data.size = humanReadableBytes data.size

      html = template.tmpl data
      $(@el).html html
      $(@el)
        .removeClass(ZPool::statusList.join ' ')
        .addClass @model.get('status')
      @el

  DiskView
