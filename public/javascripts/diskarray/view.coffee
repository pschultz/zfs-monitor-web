define ['disk/view'], (DiskView) ->
  class DiskArrayView extends Backbone.View
    initialize: ->
      return unless @model

      @model.get('disks').on 'add', @renderDisk

      self = @
      @model.collection.on 'remove', (diskArray) ->
        self.remove() if diskArray.cid == self.model.cid

    render: =>
      template = $ "#diskarray-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

      disks = @model.get 'disks'

      disks.each @renderDisk
      $(@el)

    renderDisk: (disk) =>
      view = new DiskView
        model: disk
        tagName: 'div'
        className: 'disk'
        id: disk.cid

      @$('.disks').append view.render()


  DiskArrayView
