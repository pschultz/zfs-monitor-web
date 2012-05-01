var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zfs/view'], function(ZfsView) {
  var ZfsDistributionView;
  ZfsDistributionView = (function(_super) {

    __extends(ZfsDistributionView, _super);

    function ZfsDistributionView() {
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
        series: []
      };
    };

    ZfsDistributionView.prototype.initialize = function() {
      this.chartId = "" + this.model.cid + "-distribution-chart";
      return this.model.get('filesystems').on('add remove change', this.render);
    };

    ZfsDistributionView.prototype.render = function() {
      var html, template;
      template = $("#zfs-distribution-tmpl");
      html = template.tmpl();
      $(this.el).html(html);
      this.renderChart(this.chartConfig());
      return this.el;
    };

    ZfsDistributionView.prototype.renderChart = function(chartDefinition) {
      var chartContainer, poolSize;
      chartContainer = this.$("#" + this.chartId);
      if (!chartContainer.length) {
        chartContainer = $("<div id='" + this.chartId + "'></div>");
        chartContainer.addClass('capacity pie chart');
        this.$(".content").append(chartContainer);
      }
      chartDefinition.chart.renderTo = chartContainer[0];
      poolSize = this.model.get('size');
      if (poolSize) chartDefinition.series.push(this.getChartSeries());
      return new Highcharts.Chart(chartDefinition);
    };

    ZfsDistributionView.prototype.getChartSeries = function(poolSize) {
      var othersSize, poolName, poolPattern, series;
      poolSize = this.model.get('size');
      poolName = this.model.get('name');
      poolPattern = new RegExp("^" + poolName + "/?");
      series = {
        type: 'pie',
        name: 'Pool Distribution',
        data: []
      };
      othersSize = 0;
      this.model.get('filesystems').each(function(zfs) {
        var fsName, poolPercentage, zfsSize;
        zfsSize = zfs.get('size');
        fsName = zfs.get('name').replace(poolPattern, '');
        if (!fsName.length) fsName = '/';
        poolPercentage = zfsSize / poolSize;
        if (poolPercentage < .05) {
          return othersSize += zfsSize;
        } else {
          return series.data.push([fsName, zfsSize / poolSize]);
        }
      });
      if (othersSize) series.data.push(['other', othersSize / poolSize]);
      return series;
    };

    return ZfsDistributionView;

  })(Backbone.View);
  return ZfsDistributionView;
});
