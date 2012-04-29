define ['dataset/model', 'diskarray/collection'], (Dataset, DiskArrayCollection) ->
  class ZPoolModel extends Dataset
    defaults:
      size: 0
      free: 0
      allocated: 0
      name: 'unnamed'
      diskArrays: null

  ZPoolModel
