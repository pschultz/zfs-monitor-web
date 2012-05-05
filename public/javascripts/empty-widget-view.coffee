define ->
  class EmptyWidgetView extends Backbone.View
    render: ->
      template = $ "#empty-widget-tmpl"
      html = template.tmpl()
      $(@el).html html

  EmptyWidgetView
