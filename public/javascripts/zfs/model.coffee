define ['dataset/model'], (Dataset) ->
  class ZfsModel extends Dataset
    defaults:
      size: 0
      free: 0
      allocated: 0
      name: 'unnamed'

  ZfsModel

