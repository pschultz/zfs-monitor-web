var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var ZfsDistributionView;
  ZfsDistributionView = (function(_super) {

    __extends(ZfsDistributionView, _super);

    function ZfsDistributionView() {
      this.renderChart = __bind(this.renderChart, this);
      this.render = __bind(this.render, this);
      ZfsDistributionView.__super__.constructor.apply(this, arguments);
    }

    ZfsDistributionView.prototype.chartConfig = function() {
      return {
        chart: {
          renderTo: this.chartId,
          plotBackgroundColor: 'transparent',
          backgroundColor: 'transparent',
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: 'Pool Distribution',
          style: {
            color: '#D3D4D4',
            fontSize: '20px',
            fontFamily: 'Arial,Tahoma, Geneva, sans-serif'
          }
        },
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
            name: 'Pool Distribution',
            data: []
          }
        ]
      };
    };

    ZfsDistributionView.prototype.initialize = function() {
      this.chartId = "" + this.model.cid + "-distribution-chart";
      return this.model.get('filesystems').on('add remove change', this.renderChart);
    };

    ZfsDistributionView.prototype.render = function() {
      var html, template;
      template = $("#zfs-distribution-tmpl");
      html = template.tmpl();
      $(this.el).html(html);
      this.renderChart(this.chartConfig());
      return this.el;
    };

    ZfsDistributionView.prototype.renderChart = function() {
      if (!this.model.get('size')) return;
      if (!((this.chartContainer != null) && (this.chart != null))) {
        this.createChart();
      }
      return this.updateChart();
    };

    ZfsDistributionView.prototype.createChart = function() {
      var chartDefinition;
      this.chartContainer = this.$("#" + this.chartId);
      this.chartContainer = $("<div id='" + this.chartId + "'></div>");
      this.chartContainer.addClass('distribution pie chart');
      this.$(".content").append(this.chartContainer);
      chartDefinition = this.chartConfig();
      chartDefinition.chart.renderTo = this.chartContainer[0];
      return this.chart = new Highcharts.Chart(chartDefinition);
    };

    ZfsDistributionView.prototype.updateChart = function() {
      return this.chart.series[0].setData(this.getChartData());
    };

    ZfsDistributionView.prototype.getChartData = function() {
      var data, othersSize, poolName, poolPattern, poolSize;
      data = [];
      poolSize = this.model.get('size');
      poolName = this.model.get('name');
      poolPattern = new RegExp("^" + poolName + "/?");
      othersSize = 0;
      this.model.get('filesystems').each(function(zfs) {
        var fsName, poolPercentage, zfsSize;
        zfsSize = zfs.get('size');
        fsName = zfs.get('name').replace(poolPattern, '');
        if (!fsName.length) fsName = '/';
        poolPercentage = zfsSize / poolSize;
        if (poolPercentage < .03) {
          return othersSize += zfsSize;
        } else {
          return data.push([fsName, zfsSize]);
        }
      });
      if (othersSize) data.push(['<i>other</i>', othersSize]);
      return data;
    };

    return ZfsDistributionView;

  })(Backbone.View);
  return ZfsDistributionView;
});
