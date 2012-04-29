define ['disk/view'], (DiskView) ->
  class DiskArrayView extends Backbone.View
    render: =>
      template = $ "#diskarray-tmpl"
      html = template.tmpl @model.toJSON()
      @el = $(html)

      disks = @model.get 'disks'
      #console.log disks

      #self = @
      disks.each @renderDisk
      $(@el)

    renderDisk: (disk) =>
      #console.log @el
      view = new DiskView
        model: disk
        el: @$("##{disk.cid}")
      $(@el).find('.disks').append view.render()


  DiskArrayView
