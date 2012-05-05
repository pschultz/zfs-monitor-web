var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/model', 'disk/view'], function(ZPool, DiskView) {
  var ZPoolCaptionView;
  ZPoolCaptionView = (function(_super) {

    __extends(ZPoolCaptionView, _super);

    function ZPoolCaptionView() {
      this.renderDisk = __bind(this.renderDisk, this);
      this.onChangeStatus = __bind(this.onChangeStatus, this);
      this.onChangeName = __bind(this.onChangeName, this);
      this.render = __bind(this.render, this);
      ZPoolCaptionView.__super__.constructor.apply(this, arguments);
    }

    ZPoolCaptionView.prototype.initialize = function() {
      this.model.on('change:name', this.onChangeName);
      this.model.get('spareDisks').on('add', this.renderDisk);
      this.model.get('logDisks').on('add', this.renderDisk);
      return this.model.get('cacheDisks').on('add', this.renderDisk);
    };

    ZPoolCaptionView.prototype.render = function() {
      var html, template;
      template = $("#zpool-caption-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      this.onChangeStatus();
      this.model.get('spareDisks').each(this.renderDisk);
      this.model.get('logDisks').each(this.renderDisk);
      this.model.get('cacheDisks').each(this.renderDisk);
      return this.el;
    };

    ZPoolCaptionView.prototype.onChangeName = function() {
      return this.$(".name").text(this.model.get('name'));
    };

    ZPoolCaptionView.prototype.onChangeStatus = function() {
      this.$(".status").text(this.model.get('status'));
      return this.$("h1").removeClass(ZPool.prototype.statusList.join(' ')).addClass(this.model.get('status'));
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
