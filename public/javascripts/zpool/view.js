var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/caption-view', 'diskarray/view', 'iostats/view', 'scan/view', 'zfs/filesystem-view', 'empty-widget-view'], function(ZPoolCaptionView, DiskarrayView, IostatsView, ScanView, FilesystemView, EmptyWidgetView) {
  var ZPoolView;
  ZPoolView = (function(_super) {

    __extends(ZPoolView, _super);

    function ZPoolView() {
      this.renderFilesystems = __bind(this.renderFilesystems, this);
      this.renderScans = __bind(this.renderScans, this);
      this.renderTail = __bind(this.renderTail, this);
      this.renderDiskarray = __bind(this.renderDiskarray, this);
      this.renderCaption = __bind(this.renderCaption, this);
      this.render = __bind(this.render, this);
      ZPoolView.__super__.constructor.apply(this, arguments);
    }

    ZPoolView.prototype.initialize = function() {
      if (!this.model) return;
      return this.model.get('diskArrays').on('add', this.renderDiskarray);
    };

    ZPoolView.prototype.render = function() {
      var html, i, template;
      template = $("#zpool-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.renderCaption();
      for (i = 1; i <= 4; i++) {
        this.renderTail();
      }
      this.model.get('diskArrays').each(this.renderDiskarray);
      this.renderScans();
      this.renderFilesystems();
      setTimeout(function() {
        return $(window).trigger('resize');
      }, 20);
      return this.el;
    };

    ZPoolView.prototype.renderCaption = function() {
      var captionView;
      captionView = new ZPoolCaptionView({
        model: this.model,
        className: 'pool-caption widget head r1'
      });
      return $(this.el).prepend(captionView.render());
    };

    ZPoolView.prototype.renderDiskarray = function(diskarray) {
      var view;
      if (diskarray.isSpecialArray()) return;
      view = new DiskarrayView({
        model: diskarray,
        tagName: 'div',
        id: diskarray.cid,
        className: 'diskarray widget c1 r1'
      });
      this.$(".empty.widget").first().before(view.render());
      return this.$(".empty.widget").last().remove();
    };

    ZPoolView.prototype.renderTail = function() {
      var view;
      view = new EmptyWidgetView({
        className: 'empty widget c1 r1'
      });
      return this.$(".diskarrays").append(view.render());
    };

    ZPoolView.prototype.renderScans = function() {
      var view;
      view = new ScanView({
        model: this.model,
        collection: this.model.get('scans'),
        className: 'scans widget head r2'
      });
      return $(this.el).append(view.render());
    };

    ZPoolView.prototype.renderFilesystems = function() {
      var view;
      view = new FilesystemView({
        model: this.model,
        className: 'filesystems widget-container'
      });
      return $(this.el).append(view.render());
    };

    return ZPoolView;

  })(Backbone.View);
  return ZPoolView;
});
