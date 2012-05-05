var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['disk/view'], function(DiskView) {
  var DiskarrayView;
  DiskarrayView = (function(_super) {

    __extends(DiskarrayView, _super);

    function DiskarrayView() {
      this.renderDisk = __bind(this.renderDisk, this);
      this.render = __bind(this.render, this);
      DiskarrayView.__super__.constructor.apply(this, arguments);
    }

    DiskarrayView.prototype.initialize = function() {
      var self;
      if (!this.model) return;
      this.model.get('disks').on('add', this.renderDisk);
      self = this;
      return this.model.collection.on('remove', function(diskarray) {
        if (diskarray.cid === self.model.cid) return self.remove();
      });
    };

    DiskarrayView.prototype.render = function() {
      var disks, html, template;
      template = $("#diskarray-special-tmpl");
      html = template.tmpl(this.model.toJSON());
      $(this.el).html(html);
      disks = this.model.get('disks');
      disks.each(this.renderDisk);
      return this.el;
    };

    DiskarrayView.prototype.renderDisk = function(disk) {
      var view;
      view = new DiskView({
        model: disk,
        tagName: 'div',
        className: 'disk',
        id: disk.cid
      });
      return this.$('.disks').append(view.render());
    };

    return DiskarrayView;

  })(Backbone.View);
  return DiskarrayView;
});
