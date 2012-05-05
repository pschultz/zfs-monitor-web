define ->
  class Router extends Backbone.Router
    initialize: ->
      @view = null
      @pools = []
      @interval = setInterval @_rotate, 5000

    routes:
      'pool/:pool': 'pool'
      'pool':       'pool'

    pool: (name = '') =>
      if not name.length and not @interval
        @interval = setInterval @_rotate, 5000
        return

      self = @
      _.each @pools, (view) ->
        return unless view.model.get('name') is name
        self._render view
        clearInterval self.interval
        self.interval = 0

    _rotate: =>
      return unless @pools.length
      @_render @pools.shift()
      @pools.push @view

    _render: (view) ->
        $(@view.el).detach() if @view?
        @view = view
        $("#root").html @view.render()


  Router
