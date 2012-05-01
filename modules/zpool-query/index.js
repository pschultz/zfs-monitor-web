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
    var diskArrayStartPattern, i, line, lines, nextPoolPattern, nil, pool, poolAnalysers, poolName, poolStatusPattern, specialDiskStartPattern, _ref, _ref2, _ref3;
    lines = this.zpoolStatusOutput.split(/\n/);
    nextPoolPattern = /^  pool: (\S+)/;
    poolStatusPattern = /^ state: (\S+)/;
    poolAnalysers = [];
    diskArrayStartPattern = /^        NAME/;
    specialDiskStartPattern = /^        (log|spare|cache)/;
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
      if (diskArrayStartPattern.test(line)) {
        console.log("array analysis on " + pool.name);
        i = this.analyseDiskArrays(lines, i + 2, pool);
      }
      continue;
    }
    this.oldAnalysis = this.newAnalysis;
    return this.emit('analyzed', this.oldAnalysis);
  };

  Query.prototype.newPool = function() {
    return {
      name: 'unnamed',
      status: 'UNKNOWN',
      diskArrays: [],
      filesystems: []
    };
  };

  Query.prototype.analyseDiskArrays = function(lines, i, pool) {
    var deviceName, deviceStatus, deviceType, disk, diskArray, indentLevel, isSpecialDevice, lastIndentLevel, leadingSpaces, line, linePattern, nil, specialDeviceNamePattern, _ref, _ref2, _ref3;
    linePattern = /^ +(\S+) *(\S+)?/;
    specialDeviceNamePattern = /^((raidz\d|mirror|logs|spares|cache)\S*)/;
    leadingSpaces = /^ +/.exec(lines[i])[0];
    lastIndentLevel = Infinity;
    diskArray = null;
    for (i = i, _ref = lines.length - 1; i <= _ref ? i <= _ref : i >= _ref; i <= _ref ? i++ : i--) {
      line = lines[i];
      console.log('------------------------------');
      console.log(line);
      if (line.match(/^\s*$/)) break;
      leadingSpaces = /^ +/.exec(line)[0];
      indentLevel = leadingSpaces.length;
      console.log("indented by " + indentLevel + " spaces");
      deviceType = 'striped';
      _ref2 = linePattern.exec(line), nil = _ref2[0], deviceName = _ref2[1], deviceStatus = _ref2[2];
      console.log("preliminary device name: " + deviceName);
      isSpecialDevice = specialDeviceNamePattern.test(deviceName);
      if (isSpecialDevice) {
        console.log("special device found");
        _ref3 = specialDeviceNamePattern.exec(deviceName), nil = _ref3[0], deviceName = _ref3[1], deviceType = _ref3[2];
        console.log("name=" + deviceName + ", type=" + deviceType + ", status=" + deviceStatus);
        console.log("creating new array");
        diskArray = this.addDiskarray(deviceName, deviceType, deviceStatus, pool);
        lastIndentLevel = indentLevel;
        continue;
      }
      if (indentLevel < lastIndentLevel) {
        console.log("unindented, creating new array");
        diskArray = this.addDiskarray(deviceName, deviceType, deviceStatus, pool);
        lastIndentLevel = indentLevel;
        if (diskArray.type !== 'striped') continue;
      }
      disk = this.newDisk();
      disk.name = deviceName;
      disk.status = deviceStatus;
      console.log("appending disk " + disk.name + ": " + disk.status);
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
