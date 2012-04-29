var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['diskarray/view', 'zfs/capacity-view', 'zfs/distribution-view'], function(DiskArrayView, ZfsCapacityView, ZfsDistributionView) {
  var ZPoolView;
  ZPoolView = (function(_super) {

    __extends(ZPoolView, _super);

    function ZPoolView() {
      this.renderDiskArray = __bind(this.renderDiskArray, this);
      this.render = __bind(this.render, this);
      ZPoolView.__super__.constructor.apply(this, arguments);
    }

    ZPoolView.prototype.render = function() {
      var diskArrays, html, template;
      template = $("#zpool-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.$("h2").addClass(this.model.get('status'));
      diskArrays = this.model.get('diskArrays');
      diskArrays.each(this.renderDiskArray);
      this.renderZfsCapacity();
      this.renderZfsDistribution();
      return this.el;
    };

    ZPoolView.prototype.renderDiskArray = function(diskArray) {
      var view;
      view = new DiskArrayView({
        model: diskArray,
        el: this.$("#" + diskArray.cid)
      });
      return this.$("#arrays").append(view.render());
    };

    ZPoolView.prototype.renderZfsCapacity = function() {
      var view;
      view = new ZfsCapacityView({
        model: this.model
      });
      return this.$("#filesystems").append(view.render());
    };

    ZPoolView.prototype.renderZfsDistribution = function() {
      var view;
      view = new ZfsDistributionView({
        collection: this.model.get('filesystems')
      });
      return this.$("#filesystems").append(view.render());
    };

    return ZPoolView;

  })(Backbone.View);
  return ZPoolView;
});
