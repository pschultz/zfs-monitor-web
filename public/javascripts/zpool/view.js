var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/caption-view', 'diskarray/view', 'scan/view', 'zfs/filesystem-view'], function(ZPoolCaptionView, DiskArrayView, ScanView, FilesystemView) {
  var ZPoolView;
  ZPoolView = (function(_super) {

    __extends(ZPoolView, _super);

    function ZPoolView() {
      this.renderFilesystems = __bind(this.renderFilesystems, this);
      this.renderScans = __bind(this.renderScans, this);
      this.renderDiskArray = __bind(this.renderDiskArray, this);
      this.renderCaption = __bind(this.renderCaption, this);
      this.render = __bind(this.render, this);
      ZPoolView.__super__.constructor.apply(this, arguments);
    }

    ZPoolView.prototype.initialize = function() {
      if (!this.model) return;
      return this.model.get('diskArrays').on('add', this.renderDiskArray);
    };

    ZPoolView.prototype.render = function() {
      var html, template;
      template = $("#zpool-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.renderCaption();
      this.renderScans();
      this.renderFilesystems();
      return this.el;
    };

    ZPoolView.prototype.renderCaption = function() {
      var captionView;
      captionView = new ZPoolCaptionView({
        model: this.model,
        id: 'pool-caption',
        className: 'widget head r1'
      });
      return $(this.el).prepend(captionView.render());
    };

    ZPoolView.prototype.renderDiskArray = function(diskArray) {
      var view;
      view = new DiskArrayView({
        model: diskArray,
        tagName: 'div',
        id: this.model.cid,
        className: 'diskarray widget c1 r1'
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
