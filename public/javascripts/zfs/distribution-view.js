var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zfs/view'], function(ZfsView) {
  var ZfsDistributionView;
  ZfsDistributionView = (function(_super) {

    __extends(ZfsDistributionView, _super);

    function ZfsDistributionView() {
      this.renderZfs = __bind(this.renderZfs, this);
      this.render = __bind(this.render, this);
      ZfsDistributionView.__super__.constructor.apply(this, arguments);
    }

    ZfsDistributionView.prototype.initialize = function() {
      return this.collection.on('add remove change', this.render);
    };

    ZfsDistributionView.prototype.render = function() {
      var html, template;
      template = $("#zfs-distribution-tmpl");
      html = template.tmpl();
      $(this.el).html(html);
      this.collection.each(this.renderZfs);
      return this.el;
    };

    ZfsDistributionView.prototype.renderZfs = function(zfs) {
      var view;
      view = new ZfsView({
        model: zfs
      });
      return this.$(".content").append(view.render());
    };

    return ZfsDistributionView;

  })(Backbone.View);
  return ZfsDistributionView;
});
