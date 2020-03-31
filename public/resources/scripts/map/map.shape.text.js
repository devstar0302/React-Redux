fabric.ShapeText = fabric.util.createClass(fabric.Textbox, {
  onMoving: function(e, diff, group){
    var me = this;
    me.updateLines(group, diff, me);
  },

  onScaling: function(e) {
    var me = this;
    me.updateLines();
  },

  onEditStateChange: function(editable){
    var me = this;
    me.selectable = editable;
  },

  getConnectionPoint: function(point, group) {
    return mapObject.getConnectionPoint(this, point, group);
  },

  onMoved: function(group) {
    var me = this;
    return me.notifyMoved(group);
  },

  onTextChanged: function() {
    var me = this;
    var map = me.canvas.map;
    map.notifyTextChanged(me.id, me.text);
  },

  notifyMoved: function(group) {
    var me = this;
    var map = me.canvas.map;

    return map.notifyMoved(me.id, {
      left: me.left + (group ? group.oCoords.mt.x: 0),
      top: me.top + (group ? group.oCoords.ml.y: 0),
      width: me.width * me.scaleX,
      height: me.height * me.scaleY,
    }, {
      size: me.fontSize,
      align: me.textAlign,
    }, null, me.data.fatherid);
  },

  remove: function(){
    var me = this;
    var map = me.canvas.map;

    $.each(me.lines.splice(0), function(i, line){
      line.remove();
    });

    map.removeObject(me);
    me.canvas.remove(me);

    this.callSuper('remove');
  },

  updateLines: function(group, diff, object) {
    var me = this;
    $.each(me.lines, function(i, line){
      line.updatePosition(group, diff, object);
    });
  },

  changeFontSize: function(increase) {
    var me = this;
    if (increase) {
      if (me.fontSize < 72) me.fontSize += 1;
    } else {
      if (me.fontSize > 10) me.fontSize -= 1;
    }
    me.canvas.renderAll();
    me.notifyMoved();
  },

  changeAlign: function(align) {
    var me = this;
    me.setTextAlign(align);
    me.notifyMoved();
  },

  update: function(config) {
    var me = this;
    me.set({
      left: config.left,
      top: config.top,
      width: config.width,
      height:config.height,
      fontSize: config.fontSize || 13,
      textAlign: config.textAlign || 'center',
      text: config.text || '',
      data: config.data,
    });

    me.setCoords();
    me.updateLines();
  },
});

fabric.ShapeText.create = function(options){
  var defaults = {
    id: 0,

    objectType: MapItemType.Shape,
    objectSubType: MapItemType.ShapeText,
    text: '',

    fontSize: 13,
    fontFamily: "Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif",
    fill: '#fff',
    textAlign: 'center',

    selectable: options.canvas.map.editable,
    lines: [],
    canvas: null,
    hasRotatingPoint: false
  };

  var config = $.extend({}, defaults, options);

  var deviceObj = new fabric.ShapeText(config.text, config);
  config.canvas.add(deviceObj);

  return deviceObj;
};