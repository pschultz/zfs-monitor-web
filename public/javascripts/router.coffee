define ->
  class Router extends Backbone.Router
    timePerPool: 30000
    initialize: ->
      @view = null
      @pools = []
      @interval = 0

    routes:
      'pool/:pool': 'pool'
      'pool':       'pool'

    pool: (name = '') =>
      return @_rotate() unless name.length

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

      @interval = setInterval @_rotate, @timePerPool unless @interval

    _render: (view) ->
        $(@view.el).detach() if @view?
        @view = view
        $("#root").html @view.render()


  Router
