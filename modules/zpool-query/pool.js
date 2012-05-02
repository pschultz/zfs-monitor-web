var ZPool, exports;

ZPool = (function() {

  function ZPool(name, status) {
    this.name = name;
    this.status = status != null ? status : 'UNKNOWN';
    this.size = 0;
    this.allocated = 0;
    this.scan = [];
    this.diskArrays = [];
    this.filesystems = [];
    this.id = require('crypto').createHash('md5').update(this.name).digest('hex');
  }

  return ZPool;

})();

module.exports = exports = ZPool;
