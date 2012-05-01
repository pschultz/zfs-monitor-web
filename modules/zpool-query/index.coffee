cproc = require 'child_process'
path = require 'path'
events = require 'events'

running = false
lastRun = 0

normalizeBytes = (input) ->
  for suffix, e in [ '', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y' ]
    pattern = new RegExp("^([+-]?[\\d.]+)#{suffix}$", 'i')

    if pattern.test input
      [ nil, numeric ] = pattern.exec input
      return Math.round(numeric * Math.pow(1024, e))

  return 0

class Query extends events.EventEmitter
  zpoolStatusOutput: ""
  spinningTreshold: [ 60000, 300000 ]

  zpool: null
  zfs: null

  deferTimer: 0

  slowDown: ->
    @spinningTreshold[0] = 60000

  keepItComin: ->
    @spinningTreshold[0] = 2000

  oldAnalysis: {}
  newAnalysis: {}

  constructor: ->
    @slowDown()
    self = @

    setInterval ->
      self.killStalledProcesses()
    , 5000

    @on 'analyzed', -> self.start()

  start: ->
    now = new Date().getTime()
    timeSinceLastRun = now - lastRun
    self = @

    startedToFast = timeSinceLastRun < @spinningTreshold[0]

    if startedToFast
      if @deferTimer == 0
        deferFor = @spinningTreshold[0] - (timeSinceLastRun)
        console.log "defering zpool queries for #{deferFor} ms"
        @deferTimer = setTimeout ->
          self.deferTimer = 0
          self.start()
        , deferFor

      return

    running = true
    lastRun = now

    @doQuery()

  killStalledProcesses: ->
    return unless running
    return unless @zpool? || @zfs?

    now = new Date().getTime()
    timeSinceLastRun = now - lastRun

    if timeSinceLastRun > @spinningTreshold[1]
      console.log 'zpool or zfs did not respond in time, killing them now'
      @emit 'stalled'
      @zpool.kill() if @zpool?
      @zfs.kill() if @zfs?

  doQuery: ->
    self = @
    @newAnalysis = {}
    @queryZpool ->
      self.analyseZpool()
      self.queryZfs ->
        self.analyseZfs()


  queryZpool: (cb) ->
    env = process.env
    env.PATH += ":" + path.normalize path.join __dirname, '../../zfsmock'

    @zpool = cproc.spawn 'zpool', ['status'], env: env

    @zpoolStatusOutput = ""
    self = @

    @zpool.stdout.setEncoding 'utf8'
    @zpool.stderr.pipe process.stderr
    @zpool.stdout.on 'data', (chunk) ->
      self.zpoolStatusOutput += chunk
    @zpool.on 'exit', (code) ->
      if code == 0
        self.zpool = null
        cb()
      else self.query()

  analyseZpool: ->
    lines = @zpoolStatusOutput.split /\n/
    nextPoolPattern   = /^  pool: (\S+)/
    poolStatusPattern = /^ state: (\S+)/
    poolScanPattern   = /^  scan: (resilver|scrub) in progress/

    diskArrayStartPattern = /^        NAME/

    @newAnalysis.pools = []
    for i in [0..lines.length - 1]
      line = lines[i]

      if nextPoolPattern.test(line)
        [ nil, poolName ] = nextPoolPattern.exec line
        pool = @newPool()
        pool.name = poolName
        @newAnalysis.pools.push pool
        continue

      if poolStatusPattern.test(line)
        [ nil, pool.status ] = poolStatusPattern.exec line
        continue

      if poolScanPattern.test(line)
        eta = 0
        progress = 0

        [ nil, type ] = poolScanPattern.exec line

        line = lines[++i]

        etaPattern = /(\d+)h(\d)+m to go/
        if etaPattern.test line
          [ nil, hours, minutes ] = etaPattern.exec line
          eta = hours * 3600 + minutes * 60

        line = lines[++i]

        progressPattern = /([\d.]+)% done/

        if progressPattern.test line
          [ nil, percent ] = progressPattern.exec line
          progress = percent / 100

        pool.scan.push {
          type: type
          eta: eta
          progress: progress
        }

        continue


      if diskArrayStartPattern.test(line)
        i = @analyseDiskArrays lines, i+2, pool
        continue

  newPool: -> {
    name: 'unnamed'
    status: 'UNKNOWN'
    size: 0
    allocated: 0
    scan: []
    diskArrays: []
    filesystems: []
  }

  analyseDiskArrays: (lines, i, pool) ->
    linePattern = /^ +(\S+) *(\S+)?/
    specialDeviceNamePattern = /^((raidz\d|mirror|logs|spares|cache)\S*)/

    lastIndentLevel = Infinity

    diskArray = null
    for i in [i..lines.length - 1]
      line = lines[i]
      break if line.match /^\s*$/

      [ leadingSpaces ] = /^ +/.exec line
      indentLevel = leadingSpaces.length

      [ nil, deviceName, deviceStatus ] = linePattern.exec line
      deviceType = 'striped'

      isSpecialDevice = specialDeviceNamePattern.test deviceName
      if isSpecialDevice
        [ nil, deviceName, deviceType ] = specialDeviceNamePattern.exec deviceName
        diskArray = @addDiskarray deviceName, deviceType, deviceStatus, pool
        lastIndentLevel = indentLevel
        continue

      if indentLevel < lastIndentLevel
        diskArray = @addDiskarray deviceName, deviceType, deviceStatus, pool
        lastIndentLevel = indentLevel
        continue if diskArray.type isnt 'striped'

      disk = @newDisk()
      disk.name = deviceName
      disk.status = deviceStatus
      diskArray.disks.push disk

      lastIndentLevel = indentLevel
      continue

    i

  addDiskarray: (name, type, status = '', pool) ->
    diskArray = @newDiskarray()
    diskArray.name = if type == 'striped' then '' else name
    diskArray.type = type
    diskArray.status = status
    pool.diskArrays.push diskArray
    diskArray

  newDiskarray: -> {
    name: 'unnamed'
    type: 'unknown'
    disks: []
  }

  newDisk: -> {
    name: 'unknown'
    status: 'UNKNOWN'
  }

  queryZfs: (cb) ->
    env = process.env
    env.PATH += ":" + path.normalize path.join __dirname, '../../zfsmock'

    @zfs = cproc.spawn 'zfs', ['list', '-o', 'name,used,available,refer,usedbysnapshots'], env: env

    @zfsStatusOutput = ""
    self = @

    @zfs.stdout.setEncoding 'utf8'
    @zfs.stderr.pipe process.stderr
    @zfs.stdout.on 'data', (chunk) ->
      self.zfsStatusOutput += chunk
    @zfs.on 'exit', (code) ->
      if code == 0
        self.zfs = null
        cb()
      else self.query()

  analyseZfs: ->
    lines = @zfsStatusOutput.split /\n/
    snapshots = {
      size: 0
      name: '@snapshots'
    }

    lastFs = { name: '/' }
    filesystems = []

    for i in [lines.length - 1 .. 1]
      line = lines[i]
      continue unless line

      [ name, used, available, referenced, usedBySnapshot ] = line.split /\s+/
      [ poolName ] = name.split '/'

      if name isnt poolName and lastFs.name.indexOf(name) is 0
        continue

      pool = @getPoolByName(poolName)
      continue unless pool?

      if name == poolName
        pool.size = normalizeBytes(used) + normalizeBytes(available)
        snapshots.size += normalizeBytes usedBySnapshot
        continue

      fsSize = normalizeBytes referenced
      pool.allocated += fsSize

      fs = {
        size: fsSize
        name: name
      }

      lastFs = fs
      pool.filesystems.push fs

    @oldAnalysis = @newAnalysis
    @emit 'analyzed', @oldAnalysis

  getPoolByName: (name) ->
    for pool in @newAnalysis.pools
      return pool if pool.name is name


module.exports = exports = Query
