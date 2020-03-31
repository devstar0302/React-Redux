fabric.DeviceLabel = fabric.util.createClass(fabric.Textbox, {

  onMoving: function(e, diff, group){
    var me = this;
    var map = me.canvas.map;

    if(!group) me.refinePosition();

    $.each(me.lines, function(i, line){
      line.updatePosition(group);
    });
  },

  onScaling: function(e) {
    var me = this;

    me.refineWidth();

    $.each(me.lines, function(i, line){
      line.updatePosition();
    });

    me.canvas.renderAll();
  },

  refineWidth: function(){
    var me = this;

    var imgObj = me.deviceObj.imageObj;
    var maxWidth = Math.max(imgObj.width * imgObj.scaleX * 3, 300);
    if (me.width > maxWidth ) {
      me.left += (me.width - maxWidth) / 2;
      me.setWidth(maxWidth);

    }
    me.setCoords();
  },

  onEditStateChange: function(editable){
    var me = this;
    me.selectable = editable;
  },

  onTextChanged: function() {
    var me = this;
    if(me.deviceObj) {
      me.deviceObj.onLabelChanged();
    }
  },

  onMoved: function(group) {
    var me = this;
    var map = me.canvas.map;
    if(me.deviceObj) {
      return me.deviceObj.onLabelObjMoved(group);
    };

    return true;
  },

  onSelected: function() {
    var me = this;
    me.deviceObj &&
    me.deviceObj.onLabelObjectSelected();
  },

  getConnectionPoint: function(point, group) {
    var me = this;
    return me.canvas.map.getConnectionPoint(me, point, group);
  },

  refinePosition: function() {
    var me = this;
    var imgObj = me.deviceObj.imageObj;
    if(!imgObj) return;

    var bounds = 100 * Math.max(imgObj.scaleX, imgObj.scaleY);
    me.left = Math.ceil(me.left);
    me.top = Math.ceil(me.top);

    //var rect = me.getBoundingRect();

    if(me.left < imgObj.left - bounds) me.left = imgObj.left - bounds;
    if(me.top < imgObj.top - bounds) me.top = imgObj.top - bounds;
    if(me.left + me.width > imgObj.left + imgObj.width * imgObj.scaleX + bounds) me.left = Math.ceil(imgObj.left + imgObj.width * imgObj.scaleX + bounds - me.width);
    if(me.top + me.height> imgObj.top + imgObj.height * imgObj.scaleY + bounds) me.top = Math.ceil(imgObj.top + imgObj.height * imgObj.scaleY + bounds - me.height);

    me.setCoords();
  },

  onSelectionCleared: function() {
    var me = this;
    me.deviceObj.highlight(false);
  },

  onSelected: function() {
    var me = this;
    me.deviceObj.highlight(true);
  },
});

fabric.DeviceLabel.create = function(options){
  var defaults = {

    objectType: MapItemType.Device,
    objectSubType: MapItemType.DeviceLabel,

    text: '',

    fontSize: 13,
    fontFamily: "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif",
    fill: '#fff',
    textalign: 'center',

    canvas: null,
    hasRotatingPoint: false,

    deviceObj: null,
    lines: [],
  };

  var config = $.extend({}, defaults, options);

  var deviceObj = new fabric.DeviceLabel(config.text, config);
  config.canvas.add(deviceObj);

  return deviceObj;
};