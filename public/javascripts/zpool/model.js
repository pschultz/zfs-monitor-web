var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['dataset/model', 'diskarray/collection'], function(Dataset, DiskArrayCollection) {
  var ZPoolModel;
  ZPoolModel = (function(_super) {

    __extends(ZPoolModel, _super);

    function ZPoolModel() {
      ZPoolModel.__super__.constructor.apply(this, arguments);
    }

    ZPoolModel.prototype.defaults = {
      size: 0,
      free: 0,
      allocated: 0,
      name: 'unnamed',
      diskArrays: null
    };

    return ZPoolModel;

  })(Dataset);
  return ZPoolModel;
});
