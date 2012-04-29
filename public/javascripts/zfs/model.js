var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['dataset/model'], function(Dataset) {
  var ZfsModel;
  ZfsModel = (function(_super) {

    __extends(ZfsModel, _super);

    function ZfsModel() {
      ZfsModel.__super__.constructor.apply(this, arguments);
    }

    ZfsModel.prototype.defaults = {
      size: 0,
      free: 0,
      allocated: 0,
      name: 'unnamed'
    };

    return ZfsModel;

  })(Dataset);
  return ZfsModel;
});
