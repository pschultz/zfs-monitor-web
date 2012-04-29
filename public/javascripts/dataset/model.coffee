define ->
  class DatasetModel extends Backbone.Model
    defaults:
      size: 0
      free: 0
      allocated: 0
      name: 'unnamed'

    initialize: ->
      @on 'change:free change:allocated', @updateFree
      @updateFree()

    updateFree: =>
      @set 'free': @get('size') - @get('allocated')

  DatasetModel

