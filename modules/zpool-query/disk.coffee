class Disk

  constructor: (@name, @status = 'UNKNOWN', @size = 0) ->
    @id = require('crypto').createHash('md5').update(@name).digest('hex')


module.exports = exports = Disk
