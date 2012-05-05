define ->
  class ZfsView extends Backbone.View
    chartConfig: ->
      chart: {
        renderTo: @chartId,
        plotBackgroundColor: 'transparent',
        backgroundColor: 'transparent',
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: 'Pool Size',
        style: {
          color: '#D3D4D4'
          fontSize: '20px'
          fontFamily: 'Arial,Tahoma, Geneva, sans-serif'
        }
      },
      colors: [
        '#77AB13',
        '#058DC7',
      ]
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
        name: 'Pool Capacity',
        data: []
      ]

    initialize: ->
      @chartId = "#{@model.cid}-capacity-chart"
      @model.on 'change:free change:allocated change:size', @renderChart

    render: =>
      template = $ "#zfs-capacity-tmpl"
      html = template.tmpl @model.toJSON()
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
      @chartContainer.addClass 'capacity pie chart'
      @$(".content").append @chartContainer

      chartDefinition = @chartConfig()
      chartDefinition.chart.renderTo = @chartContainer[0]

      @chart = new Highcharts.Chart(chartDefinition)

    updateChart: =>
      @chart.series[0].setData @getChartData()
      @chart.setTitle text: "Pool Size: #{humanReadableBytes @model.get('size')}"

    getChartData: -> [
      ['Free',   @model.get('free')],
      ['Allocated',   @model.get('allocated')],
    ]

  ZfsView
