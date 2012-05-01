var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var ZfsView;
  ZfsView = (function(_super) {

    __extends(ZfsView, _super);

    function ZfsView() {
      this.renderChart = __bind(this.renderChart, this);
      this.render = __bind(this.render, this);
      ZfsView.__super__.constructor.apply(this, arguments);
    }

    ZfsView.prototype.chartConfig = function() {
      return {
        chart: {
          renderTo: this.chartId,
          plotBackgroundColor: 'transparent',
          backgroundColor: 'transparent',
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: 'Pool Size',
          style: {
            color: '#D3D4D4',
            fontSize: '20px',
            fontFamily: 'Arial,Tahoma, Geneva, sans-serif'
          }
        },
        colors: ['#77AB13', '#058DC7'],
        tooltip: {
          enabled: false
        },
        plotOptions: {
          pie: {
            enableMouseTracking: false,
            dataLabels: {
              enabled: true,
              color: 'white',
              connectorColor: 'white'
            }
          }
        },
        series: [
          {
            type: 'pie',
            name: 'Pool Capacity',
            data: []
          }
        ]
      };
    };

    ZfsView.prototype.initialize = function() {
      this.chartId = "" + this.model.cid + "-capacity-chart";
      return this.model.on('change:free change:allocated change:size', this.renderChart);
    };

    ZfsView.prototype.render = function() {
      var html, template;
      template = $("#zfs-capacity-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.renderChart(this.chartConfig());
      return this.el;
    };

    ZfsView.prototype.renderChart = function() {
      if (!this.model.get('size')) return;
      if (!((this.chartContainer != null) && (this.chart != null))) {
        this.createChart();
      }
      return this.updateChart();
    };

    ZfsView.prototype.createChart = function() {
      var chartDefinition;
      this.chartContainer = this.$("#" + this.chartId);
      this.chartContainer = $("<div id='" + this.chartId + "'></div>");
      this.chartContainer.addClass('capacity pie chart');
      this.$(".content").append(this.chartContainer);
      chartDefinition = this.chartConfig();
      chartDefinition.chart.renderTo = this.chartContainer[0];
      return this.chart = new Highcharts.Chart(chartDefinition);
    };

    ZfsView.prototype.updateChart = function() {
      this.chart.series[0].setData(this.getChartData());
      return this.chart.setTitle({
        text: "Pool Size: " + (humanReadableBytes(this.model.get('size')))
      });
    };

    ZfsView.prototype.getChartData = function() {
      return [['Free', this.model.get('free')], ['Allocated', this.model.get('allocated')]];
    };

    return ZfsView;

  })(Backbone.View);
  return ZfsView;
});
