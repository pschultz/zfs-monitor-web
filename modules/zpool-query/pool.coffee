class ZPool

  constructor: (@name, @status = 'UNKNOWN') ->
    @size        = 0
    @allocated   = 0
    @scan        = []
    @diskArrays  = []
    @filesystems = []
    @id = require('crypto').createHash('md5').update(@name).digest('hex')

module.exports = exports = ZPool
