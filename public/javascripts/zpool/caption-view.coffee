define ['zpool/model', 'disk/view'], (ZPool, DiskView) ->
  class ZPoolCaptionView extends Backbone.View
    initialize: ->
      @model.on 'change:name', @onChangeName

      @model.get('spareDisks').on 'add', @renderDisk
      @model.get('logDisks')  .on 'add', @renderDisk
      @model.get('cacheDisks').on 'add', @renderDisk

    render: =>
      template = $ "#zpool-caption-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html
      @onChangeStatus()

      @model.get('spareDisks').each @renderDisk
      @model.get('logDisks')  .each @renderDisk
      @model.get('cacheDisks').each @renderDisk

      @el

    onChangeName: =>
      @$(".name").text(@model.get 'name')

    onChangeStatus: =>
      @$(".status").text(@model.get 'status')
      @$("h1")
        .removeClass(ZPool::statusList.join ' ')
        .addClass(@model.get 'status')

    renderDisk: (disk) =>
      type = disk.get 'type'
      return unless type

      view = new DiskView
        model: disk
        tagName: 'div'
        className: "disk #{type}"
        id: disk.cid

      @$(".#{type}.disks").append view.render()

  ZPoolCaptionView

