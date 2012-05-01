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
      series: []

    initialize: ->
      @model.on 'change:free change:allocated change:size', @render
      @chartId = "#{@model.cid}-capacity-chart"

    render: =>
      template = $ "#zfs-capacity-tmpl"
      html = template.tmpl @model.toJSON()
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
      chartDefinition.title.text = "Pool Size: #{humanReadableBytes @model.get('size')}"

      if @model.get('size')
        chartDefinition.series.push
          type: 'pie',
          name: 'Browser share',
          data: [
            ['Free',   @model.get('free') / @model.get('size')],
            ['Allocated',   @model.get('allocated') / @model.get('size')],
          ]

      new Highcharts.Chart(chartDefinition)

  ZfsView
