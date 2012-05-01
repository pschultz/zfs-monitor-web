var Query, cproc, events, exports, lastRun, path, running,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

cproc = require('child_process');

path = require('path');

events = require('events');

running = false;

lastRun = 0;

Query = (function(_super) {

  __extends(Query, _super);

  Query.prototype.zpoolStatusOutput = "";

  Query.prototype.spinningTreshold = [60000, 300000];

  Query.prototype.zpool = null;

  Query.prototype.zfs = null;

  Query.prototype.deferTimer = 0;

  Query.prototype.slowDown = function() {
    return this.spinningTreshold[0] = 60000;
  };

  Query.prototype.keepItComin = function() {
    return this.spinningTreshold[0] = 2000;
  };

  Query.prototype.oldAnalysis = {};

  Query.prototype.newAnalysis = {};

  function Query() {
    var self;
    this.keepItComin();
    self = this;
    setInterval(function() {
      return self.killStalledProcesses();
    }, 5000);
  }

  Query.prototype.start = function() {
    var deferFor, now, self, startedToFast, timeSinceLastRun;
    now = new Date().getTime();
    timeSinceLastRun = now - lastRun;
    self = this;
    startedToFast = timeSinceLastRun < this.spinningTreshold[0];
    if (startedToFast && this.deferTimer === 0) {
      deferFor = this.spinningTreshold[0] - timeSinceLastRun;
      console.log("defering zpool queries for " + deferFor + " ms");
      this.deferTimer = setTimeout(function() {
        self.deferTimer = 0;
        return self.query();
      }, deferFor);
      return;
    }
    running = true;
    lastRun = now;
    return this.doQuery();
  };

  Query.prototype.killStalledProcesses = function() {
    var now, timeSinceLastRun;
    if (!running) return;
    if (!((this.zpool != null) || (this.zfs != null))) return;
    now = new Date().getTime();
    timeSinceLastRun = now - lastRun;
    if (timeSinceLastRun > this.spinningTreshold[1]) {
      console.log('zpool or zfs did not respond in time, killing them now');
      this.emit('stalled');
      if (this.zpool != null) this.zpool.kill();
      if (this.zfs != null) return this.zfs.kill();
    }
  };

  Query.prototype.doQuery = function() {
    var self;
    self = this;
    this.newAnalysis = {};
    return this.queryZpool(function() {
      return self.analyseZpool();
    });
  };

  Query.prototype.queryZpool = function(cb) {
    var child, env, self;
    env = process.env;
    env.PATH += ":" + path.normalize(path.join(__dirname, '../../zfsmock'));
    child = cproc.spawn('zpool', ['status'], {
      env: env
    });
    this.zpoolStatusOutput = "";
    self = this;
    child.stdout.setEncoding('utf8');
    child.stderr.pipe(process.stderr);
    child.stdout.on('data', function(chunk) {
      return self.zpoolStatusOutput += chunk;
    });
    return child.on('exit', function(code) {
      if (code === 0) {
        self.zpool = null;
        return cb();
      } else {
        return self.query();
      }
    });
  };

  Query.prototype.analyseZpool = function() {
    var diskArrayStartPattern, eta, etaPattern, hours, i, line, lines, minutes, nextPoolPattern, nil, percent, pool, poolName, poolScanPattern, poolStatusPattern, progress, progressPattern, type, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
    lines = this.zpoolStatusOutput.split(/\n/);
    nextPoolPattern = /^  pool: (\S+)/;
    poolStatusPattern = /^ state: (\S+)/;
    poolScanPattern = /^  scan: (resilver|scrub) in progress/;
    diskArrayStartPattern = /^        NAME/;
    this.newAnalysis.pools = [];
    for (i = 0, _ref = lines.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      line = lines[i];
      if (nextPoolPattern.test(line)) {
        _ref2 = nextPoolPattern.exec(line), nil = _ref2[0], poolName = _ref2[1];
        pool = this.newPool();
        pool.name = poolName;
        this.newAnalysis.pools.push(pool);
        continue;
      }
      if (poolStatusPattern.test(line)) {
        _ref3 = poolStatusPattern.exec(line), nil = _ref3[0], pool.status = _ref3[1];
        continue;
      }
      if (poolScanPattern.test(line)) {
        eta = 0;
        progress = 0;
        _ref4 = poolScanPattern.exec(line), nil = _ref4[0], type = _ref4[1];
        line = lines[++i];
        etaPattern = /(\d+)h(\d)+m to go/;
        if (etaPattern.test(line)) {
          _ref5 = etaPattern.exec(line), nil = _ref5[0], hours = _ref5[1], minutes = _ref5[2];
          eta = hours * 3600 + minutes * 60;
        }
        line = lines[++i];
        progressPattern = /([\d.]+)% done/;
        if (progressPattern.test(line)) {
          _ref6 = progressPattern.exec(line), nil = _ref6[0], percent = _ref6[1];
          progress = percent / 100;
        }
        pool.scan.push({
          type: type,
          eta: eta,
          progress: progress
        });
        continue;
      }
      if (diskArrayStartPattern.test(line)) {
        i = this.analyseDiskArrays(lines, i + 2, pool);
        continue;
      }
    }
    this.oldAnalysis = this.newAnalysis;
    return this.emit('analyzed', this.oldAnalysis);
  };

  Query.prototype.newPool = function() {
    return {
      name: 'unnamed',
      status: 'UNKNOWN',
      scan: [],
      diskArrays: [],
      filesystems: []
    };
  };

  Query.prototype.analyseDiskArrays = function(lines, i, pool) {
    var deviceName, deviceStatus, deviceType, disk, diskArray, indentLevel, isSpecialDevice, lastIndentLevel, leadingSpaces, line, linePattern, nil, specialDeviceNamePattern, _ref, _ref2, _ref3;
    linePattern = /^ +(\S+) *(\S+)?/;
    specialDeviceNamePattern = /^((raidz\d|mirror|logs|spares|cache)\S*)/;
    lastIndentLevel = Infinity;
    diskArray = null;
    for (i = i, _ref = lines.length - 1; i <= _ref ? i <= _ref : i >= _ref; i <= _ref ? i++ : i--) {
      line = lines[i];
      if (line.match(/^\s*$/)) break;
      leadingSpaces = /^ +/.exec(line)[0];
      indentLevel = leadingSpaces.length;
      _ref2 = linePattern.exec(line), nil = _ref2[0], deviceName = _ref2[1], deviceStatus = _ref2[2];
      deviceType = 'striped';
      isSpecialDevice = specialDeviceNamePattern.test(deviceName);
      if (isSpecialDevice) {
        _ref3 = specialDeviceNamePattern.exec(deviceName), nil = _ref3[0], deviceName = _ref3[1], deviceType = _ref3[2];
        diskArray = this.addDiskarray(deviceName, deviceType, deviceStatus, pool);
        lastIndentLevel = indentLevel;
        continue;
      }
      if (indentLevel < lastIndentLevel) {
        diskArray = this.addDiskarray(deviceName, deviceType, deviceStatus, pool);
        lastIndentLevel = indentLevel;
        if (diskArray.type !== 'striped') continue;
      }
      disk = this.newDisk();
      disk.name = deviceName;
      disk.status = deviceStatus;
      diskArray.disks.push(disk);
      lastIndentLevel = indentLevel;
      continue;
    }
    return i;
  };

  Query.prototype.addDiskarray = function(name, type, status, pool) {
    var diskArray;
    if (status == null) status = '';
    diskArray = this.newDiskarray();
    diskArray.name = type === 'striped' ? '' : name;
    diskArray.type = type;
    diskArray.status = status;
    pool.diskArrays.push(diskArray);
    return diskArray;
  };

  Query.prototype.newDiskarray = function() {
    return {
      name: 'unnamed',
      type: 'unknown',
      disks: []
    };
  };

  Query.prototype.newDisk = function() {
    return {
      name: 'unknown',
      status: 'UNKNOWN'
    };
  };

  return Query;

})(events.EventEmitter);

module.exports = exports = Query;