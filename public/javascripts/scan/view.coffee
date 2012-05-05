define ->
  class ScanView extends Backbone.View
    chartConfig: ->
      chart: {
        renderTo: @chartId,
        plotBackgroundColor: 'transparent',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: '',
        style: {
          color: '#D3D4D4'
          fontSize: '20px'
          fontFamily: 'Arial,Tahoma, Geneva, sans-serif'
        }
      },
      colors: [ '#B5712E', '#058DC7']
      tooltip: { enabled: false },
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        column: {
          enableMouseTracking: false,
          dataLabels: {
            enabled: true,
            color: 'white',
            connectorColor: 'white',
            style: {
              textTransform: 'capitalize'
              fontSize: '16px'
              textShadow: '0 -1px 1px black'
            }
            formatter: ->
              "<span class='scan-chart-label'>#{@point.name}, ETA: #{@point.eta}</span>"
          },
        },
      },
      xAxis: {
        title: '',
        categories: [''],
        lineColor: '#444'
        tickColor: 'transparent'
      },
      yAxis: {
        min: 0,
        max: 100,
        title: '',
        gridLineColor: '#444'
      },
      series: [
        type: 'column',
        name: 'Pool Scans',
        data: []
      ]

    initialize: ->
      @chartId = "#{@model.cid}-scan-chart"
      @collection.on 'add remove change', @renderChart

    render: =>
      template = $ "#pool-scan-tmpl"
      html = template.tmpl()
      $(@el).html html

      @renderChart(@chartConfig())

      @el

    renderChart: =>
      @createChart() unless @chartContainer? && @chart?
      setTimeout @updateChart, 20

    createChart: ->
      @chartContainer = @$("##{@chartId}")

      @chartContainer = $ "<div id='#{@chartId}'></div>"
      @chartContainer.addClass 'scan column chart'
      @$(".content").append @chartContainer

      chartDefinition = @chartConfig()
      chartDefinition.chart.renderTo = @chartContainer[0]

      @chart = new Highcharts.Chart(chartDefinition)

    updateChart: =>
      @chart.series[0].setData @getChartData()

    getChartData: ->
      data = []

      @collection.each (scan) ->
        type = scan.get('type').toLowerCase()

        etaSec = scan.get 'eta'
        etaMin = Math.floor(etaSec / 60)
        etaHr = Math.floor(etaMin / 60)

        etaSec %= 60
        etaMin %= 60

        etaSec = if etaSec < 10 then "0#{etaSec}" else "#{etaSec}"
        etaMin = if etaMin < 10 then "0#{etaMin}" else "#{etaMin}"

        dataPoint = {
          name: type #.toUpperCase()
          eta: "#{etaHr}:#{etaMin}:#{etaSec}"
          y: Math.round(scan.get('progress') * 10000) / 100
        }

        if(type == 'resilver')
          dataPoint.color = '#AE432E'

        data.push dataPoint

      data

  ScanView
