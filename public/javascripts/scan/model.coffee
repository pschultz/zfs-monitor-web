define ->
  class ScanModel extends Backbone.Model
    defaults:
      type: 'unknown'
      eta: 0
      progress: 0
      lastResult: ''

  ScanModel
