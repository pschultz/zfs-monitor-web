var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(function() {
  var ZfsView;
  ZfsView = (function(_super) {

    __extends(ZfsView, _super);

    function ZfsView() {
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
        series: []
      };
    };

    ZfsView.prototype.initialize = function() {
      this.model.on('change:free change:allocated change:size', this.render);
      return this.chartId = "" + this.model.cid + "-capacity-chart";
    };

    ZfsView.prototype.render = function() {
      var html, template;
      template = $("#zfs-capacity-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.renderChart(this.chartConfig());
      return this.el;
    };

    ZfsView.prototype.renderChart = function(chartDefinition) {
      var chartContainer;
      chartContainer = this.$("#" + this.chartId);
      if (!chartContainer.length) {
        chartContainer = $("<div id='" + this.chartId + "'></div>");
        chartContainer.addClass('capacity pie chart');
        this.$(".content").append(chartContainer);
      }
      chartDefinition.chart.renderTo = chartContainer[0];
      chartDefinition.title.text = "Pool Size: " + (humanReadableBytes(this.model.get('size')));
      if (this.model.get('size')) {
        chartDefinition.series.push({
          type: 'pie',
          name: 'Browser share',
          data: [['Free', this.model.get('free') / this.model.get('size')], ['Allocated', this.model.get('allocated') / this.model.get('size')]]
        });
      }
      return new Highcharts.Chart(chartDefinition);
    };

    return ZfsView;

  })(Backbone.View);
  return ZfsView;
});
