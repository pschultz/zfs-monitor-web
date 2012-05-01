var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var ScanView;
  ScanView = (function(_super) {

    __extends(ScanView, _super);

    function ScanView() {
      this.renderChart = __bind(this.renderChart, this);
      this.render = __bind(this.render, this);
      ScanView.__super__.constructor.apply(this, arguments);
    }

    ScanView.prototype.chartConfig = function() {
      return {
        chart: {
          renderTo: this.chartId,
          plotBackgroundColor: 'transparent',
          backgroundColor: 'transparent',
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: '',
          style: {
            color: '#D3D4D4',
            fontSize: '20px',
            fontFamily: 'Arial,Tahoma, Geneva, sans-serif'
          }
        },
        colors: ['#B5712E', '#058DC7'],
        tooltip: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            enableMouseTracking: false,
            dataLabels: {
              enabled: true,
              color: 'white',
              connectorColor: 'white',
              style: {
                textTransform: 'capitalize',
                fontSize: '16px',
                textShadow: '0 -1px 1px black'
              },
              formatter: function() {
                return "<span class='scan-chart-label'>" + this.point.name + ", ETA: " + this.point.eta + "</span>";
              }
            }
          }
        },
        xAxis: {
          title: '',
          categories: [''],
          lineColor: '#444',
          tickColor: 'transparent'
        },
        yAxis: {
          min: 0,
          max: 100,
          title: '',
          gridLineColor: '#444'
        },
        series: [
          {
            type: 'column',
            name: 'Pool Scans',
            data: []
          }
        ]
      };
    };

    ScanView.prototype.initialize = function() {
      this.chartId = "" + this.model.cid + "-scan-chart";
      return this.collection.on('add remove change', this.renderChart);
    };

    ScanView.prototype.render = function() {
      var html, template;
      template = $("#pool-scan-tmpl");
      html = template.tmpl();
      $(this.el).html(html);
      this.renderChart(this.chartConfig());
      return this.el;
    };

    ScanView.prototype.renderChart = function() {
      if (!this.collection.length) return;
      if (!((this.chartContainer != null) && (this.chart != null))) {
        this.createChart();
      }
      return this.updateChart();
    };

    ScanView.prototype.createChart = function() {
      var chartDefinition;
      this.chartContainer = this.$("#" + this.chartId);
      this.chartContainer = $("<div id='" + this.chartId + "'></div>");
      this.chartContainer.addClass('scan column chart');
      this.$(".content").append(this.chartContainer);
      chartDefinition = this.chartConfig();
      chartDefinition.chart.renderTo = this.chartContainer[0];
      return this.chart = new Highcharts.Chart(chartDefinition);
    };

    ScanView.prototype.updateChart = function() {
      return this.chart.series[0].setData(this.getChartData());
    };

    ScanView.prototype.getChartData = function() {
      var data;
      data = [];
      this.collection.each(function(scan) {
        var dataPoint, etaHr, etaMin, etaSec, type;
        type = scan.get('type').toLowerCase();
        etaSec = scan.get('eta');
        etaMin = Math.floor(etaSec / 60);
        etaHr = Math.floor(etaMin / 60);
        etaSec %= 60;
        etaMin %= 60;
        etaSec = etaSec < 10 ? "0" + etaSec : "" + etaSec;
        etaMin = etaMin < 10 ? "0" + etaMin : "" + etaMin;
        dataPoint = {
          name: type,
          eta: "" + etaHr + ":" + etaMin + ":" + etaSec,
          y: Math.round(scan.get('progress') * 10000) / 100
        };
        if (type === 'resilver') dataPoint.color = '#AE432E';
        return data.push(dataPoint);
      });
      return data;
    };

    return ScanView;

  })(Backbone.View);
  return ScanView;
});
