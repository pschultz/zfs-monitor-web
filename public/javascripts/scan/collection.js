var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

define(['zpool/model'], function(Scan) {
  var ScanCollection;
  ScanCollection = (function(_super) {

    __extends(ScanCollection, _super);

    function ScanCollection() {
      ScanCollection.__super__.constructor.apply(this, arguments);
    }

    ScanCollection.prototype.model = Scan;

    return ScanCollection;

  })(Backbone.Collection);
  return ScanCollection;
});
