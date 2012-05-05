define ['zpool/model', 'diskarray/special-view'], (ZPool, SpecialDiskarrayView) ->
  class ZPoolCaptionView extends Backbone.View
    initialize: ->
      @model.on 'change:name', @onChangeName
      @model.on 'change:status', @onChangeStatus

      @model.get('diskArrays').on 'add', @renderDiskarray

    render: =>
      template = $ "#zpool-caption-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html
      @onChangeStatus()

      @model.get('diskArrays').each @renderDiskarray

      @el

    onChangeName: =>
      @$(".name").text(@model.get 'name')

    onChangeStatus: =>
      @$(".status")
        .text(@model.get 'status')
        .removeClass(ZPool::statusList.join ' ')
        .addClass(@model.get 'status')

    renderDiskarray: (diskarray) =>
      return unless diskarray.isSpecialArray()

      view = new SpecialDiskarrayView
        model: diskarray
        tagName: 'div'
        id: diskarray.cid
        className: 'diskarray'

      @$(".special-disks").append view.render()

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

