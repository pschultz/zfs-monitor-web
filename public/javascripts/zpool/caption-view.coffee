define ['zpool/model'], (ZPool) ->
  class ZPoolCaptionView extends Backbone.View
    initialize: ->
      @model.on 'change:name', @onChangeName
      @model.on 'change:status', @onChangeStatus

    render: =>
      template = $ "#zpool-caption-tmpl"
      html = template.tmpl @model.toJSON()
      $(@el).html html

    onChangeName: =>
      @$("h1").text(@model.get 'name')

    onChangeStatus: =>
      @$("h2")
        .text(@model.get 'status')
        .removeClass(ZPool::statusList.join ' ')
        .addClass(@model.get 'status')

  ZPoolCaptionView

