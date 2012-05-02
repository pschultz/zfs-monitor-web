var Filesystem, exports;

Filesystem = (function() {

  function Filesystem(name, size) {
    this.name = name;
    this.size = size != null ? size : 0;
    this.id = require('crypto').createHash('md5').update(this.name).digest('hex');
  }

  return Filesystem;

})();

module.exports = exports = Filesystem;
