define ->
  class ZfsDistributionView extends Backbone.View
    chartConfig: ->
      chart: {
        renderTo: @chartId,
        plotBackgroundColor: 'transparent',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: 'Pool Distribution',
        style: {
          color: '#D3D4D4'
          fontSize: '20px'
          fontFamily: 'Arial,Tahoma, Geneva, sans-serif'
        }
      },
      tooltip: { enabled: false },
      plotOptions: {
        pie: {
          enableMouseTracking: false,
          dataLabels: {
            enabled: true,
            color: 'white',
            connectorColor: 'white',
          },
        },
      },
      series: [
        type: 'pie',
        name: 'Pool Distribution',
        data: []
      ]

    initialize: ->
      @chartId = "#{@model.cid}-distribution-chart"
      @model.get('filesystems').on 'add remove change', @renderChart

    render: =>
      template = $ "#zfs-distribution-tmpl"
      html = template.tmpl()
      $(@el).html html

      @renderChart(@chartConfig())

      @el

    renderChart: =>
      return unless @model.get('size')

      @createChart() unless @chartContainer? && @chart?
      setTimeout @updateChart, 20

    createChart: ->
      @chartContainer = @$("##{@chartId}")

      @chartContainer = $ "<div id='#{@chartId}'></div>"
      @chartContainer.addClass 'distribution pie chart'
      @$(".content").append @chartContainer

      chartDefinition = @chartConfig()
      chartDefinition.chart.renderTo = @chartContainer[0]

      @chart = new Highcharts.Chart(chartDefinition)

    updateChart: =>
      @chart.series[0].setData @getChartData()

    getChartData: ->
      data = []
      poolSize = @model.get 'size'
      poolName = @model.get 'name'
      nrOfFilesystems = @model.get('filesystems').length
      poolPattern = new RegExp("^#{poolName}/?")
      othersSize = 0
      othersThreshold = nrOfFilesystems / 400

      @model.get('filesystems').each (zfs) ->
        zfsSize = zfs.get 'size'
        fsName = zfs.get('name').replace(poolPattern, '')
        fsName = '/' unless fsName.length

        poolPercentage = zfsSize / poolSize

        if poolPercentage < othersThreshold and fsName isnt '@snapshots'
          othersSize += zfsSize
        else
          data.push [fsName, zfsSize],

      if(othersSize)
          data.push ['<i>other</i>', othersSize],

      data

  ZfsDistributionView
