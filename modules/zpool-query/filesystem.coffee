class Filesystem

  constructor: (@name, @size = 0) ->
    @id = require('crypto').createHash('md5').update(@name).digest('hex')

module.exports = exports = Filesystem

