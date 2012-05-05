define ->
  class DatasetModel extends Backbone.Model
    defaults:
      size: 0
      free: 0
      allocated: 0
      name: 'unnamed'

    initialize: ->
      @on 'change:size', @onChangeSize
      @on 'change:allocated', @onChangeAllocated
      @calculateFree()

    onChangeSize: =>
      @calculateFree()

    onChangeAllocated: =>
      @calculateFree()

    calculateFree: =>
      @set { free: @get('size') - @get('allocated') }, silent: true

  DatasetModel

