fabric.ShapeHub = fabric.util.createClass(fabric.Image, {
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
    return mapObject.getConnectionPoint(this, point, group, true);
  },

  onMoved: function(group) {
    var me = this;
    var map = me.canvas.map;


    return map.notifyMoved(me.id, {
      left: me.left + (group ? (group.left + group.width / 2): 0),
      top: me.top + (group ? (group.top + group.height / 2): 0),
      width: me.width * me.scaleX,
      height: me.height * me.scaleY,
      angle: me.angle,
    }, null, null, me.data.fatherid);
  },

  rotate: function(right) {
    var me = this;
    var angle = me.getAngle();
    angle += right ? 45 : -45;

    if (angle < 0) angle += 360;
    if (angle >= 360) angle %= 360;

    me.setAngle(angle);

    me.setCoords();
    me.updateLines();

    me.onMoved();

    me.canvas.renderAll();
  },

  updateLines: function(group, diff, object) {
    var me = this;
    $.each(me.lines, function(i, line){
      line.updatePosition(group, diff, object);
    });
  },

  update: function(config) {
    var me = this;
    me.set({
      left: config.left,
      top: config.top,
      width: config.width,
      height:config.height,
      angle: config.angle || 0,
      data: config.data,
    });

    me.setCoords();
    me.updateLines();
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
});

fabric.ShapeHub.create = function(options){
  var defaults = {
    imageUrl: '/images/longhub.png',
    canvas: null,
  };

  var config = $.extend({}, defaults, options);

  //Image
  var hub = new fabric.ShapeHub();
  hub.set({
    id: config.id,

    objectType: MapItemType.Shape,
    objectSubType: MapItemType.ShapeHub,

    left: config.left,
    top: config.top,
    width: config.width,
    height:config.height,

    lines: [],
    hasRotatingPoint: false,
    angle: config.angle || 0,

    data: config.data,
  });
  hub.setCoords();

  hub.setSrc(config.imageUrl, function(){
    hub.set({
      left: config.left,
      top: config.top,
      width: config.width,
      height:config.height,
      angle: config.angle || 0,
    }, {crossOrigin: 'anonymous'});

    hub.onEditStateChange(config.canvas.map.editable);

    config.canvas.add(hub);
  });

  return hub;
};