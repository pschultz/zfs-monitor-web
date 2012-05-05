define ['disk/view'], (DiskView) ->
  class DiskarrayView extends Backbone.View
    initialize: ->
      return unless @model

      @model.get('disks').on 'add', @renderDisk

      self = @
      @model.collection.on 'remove', (diskarray) ->
        self.remove() if diskarray.cid == self.model.cid

    render: =>
      template = $ "#diskarray-special-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

      disks = @model.get 'disks'
      disks.each @renderDisk

      @el

    renderDisk: (disk) =>
      view = new DiskView
        model: disk
        tagName: 'div'
        className: 'disk'
        id: disk.cid

      @$('.disks').append view.render()


  DiskarrayView
