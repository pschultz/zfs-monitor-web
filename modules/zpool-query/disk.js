var Disk, exports;

Disk = (function() {

  function Disk(name, status, size) {
    this.name = name;
    this.status = status != null ? status : 'UNKNOWN';
    this.size = size != null ? size : 0;
    this.id = require('crypto').createHash('md5').update(this.name).digest('hex');
  }

  return Disk;

})();

module.exports = exports = Disk;
