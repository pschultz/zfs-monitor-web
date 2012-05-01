define ['zfs/view'], (ZfsView) ->
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
      series: []

    initialize: ->
      @chartId = "#{@model.cid}-distribution-chart"
      @model.get('filesystems').on 'add remove change', @render

    render: =>
      template = $ "#zfs-distribution-tmpl"
      html = template.tmpl()
      $(@el).html html

      @renderChart(@chartConfig())

      @el

    renderChart: (chartDefinition) ->
      chartContainer = @$("##{@chartId}")
      unless chartContainer.length
        chartContainer = $ "<div id='#{@chartId}'></div>"
        chartContainer.addClass 'capacity pie chart'
        @$(".content").append chartContainer

      chartDefinition.chart.renderTo = chartContainer[0]

      poolSize = @model.get 'size'
      if poolSize
        chartDefinition.series.push @getChartSeries()

      new Highcharts.Chart(chartDefinition)

    getChartSeries: (poolSize) ->
      poolSize = @model.get 'size'
      poolName = @model.get 'name'
      poolPattern = new RegExp("^#{poolName}/?")

      series =
        type: 'pie',
        name: 'Pool Distribution',
        data: []

      othersSize = 0
      @model.get('filesystems').each (zfs) ->
        zfsSize = zfs.get 'size'
        fsName = zfs.get('name').replace(poolPattern, '')
        fsName = '/' unless fsName.length


        poolPercentage = zfsSize / poolSize

        if poolPercentage < .05
          othersSize += zfsSize
        else
          series.data.push [fsName, zfsSize / poolSize],

      if(othersSize)
          series.data.push ['other', othersSize / poolSize],

      series

  ZfsDistributionView
