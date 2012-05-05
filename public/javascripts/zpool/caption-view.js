var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/model', 'diskarray/special-view'], function(ZPool, SpecialDiskarrayView) {
  var ZPoolCaptionView;
  ZPoolCaptionView = (function(_super) {

    __extends(ZPoolCaptionView, _super);

    function ZPoolCaptionView() {
      this.renderDisk = __bind(this.renderDisk, this);
      this.renderDiskarray = __bind(this.renderDiskarray, this);
      this.onChangeStatus = __bind(this.onChangeStatus, this);
      this.onChangeName = __bind(this.onChangeName, this);
      this.render = __bind(this.render, this);
      ZPoolCaptionView.__super__.constructor.apply(this, arguments);
    }

    ZPoolCaptionView.prototype.initialize = function() {
      this.model.on('change:name', this.onChangeName);
      this.model.on('change:status', this.onChangeStatus);
      return this.model.get('diskArrays').on('add', this.renderDiskarray);
    };

    ZPoolCaptionView.prototype.render = function() {
      var html, template;
      template = $("#zpool-caption-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.onChangeStatus();
      this.model.get('diskArrays').each(this.renderDiskarray);
      return this.el;
    };

    ZPoolCaptionView.prototype.onChangeName = function() {
      return this.$(".name").text(this.model.get('name'));
    };

    ZPoolCaptionView.prototype.onChangeStatus = function() {
      this.$(".status").text(this.model.get('status'));
      return this.$("h1").removeClass(ZPool.prototype.statusList.join(' ')).addClass(this.model.get('status'));
    };

    ZPoolCaptionView.prototype.renderDiskarray = function(diskarray) {
      var view;
      if (!diskarray.isSpecialArray()) return;
      view = new SpecialDiskarrayView({
        model: diskarray,
        tagName: 'div',
        id: diskarray.cid,
        className: 'diskarray'
      });
      return this.$(".special-disks").append(view.render());
    };

    ZPoolCaptionView.prototype.renderDisk = function(disk) {
      var type, view;
      type = disk.get('type');
      if (!type) return;
      view = new DiskView({
        model: disk,
        tagName: 'div',
        className: "disk " + type,
        id: disk.cid
      });
      return this.$("." + type + ".disks").append(view.render());
    };

    return ZPoolCaptionView;

  })(Backbone.View);
  return ZPoolCaptionView;
});
