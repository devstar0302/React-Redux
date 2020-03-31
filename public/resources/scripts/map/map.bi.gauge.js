fabric.BiGauge = fabric.util.createClass(fabric.Image, {
  _render: function (ctx) {
    var me = this;
    me.callSuper('_render', ctx);

    ctx.fillStyle = "#FDB422";

    ctx.font= me.fontSize + "px " + me.fontFamily;

    var dimension = ctx.measureText(me.text);

    ctx.fillText(me.text, -dimension.width / 2, me.fontSize / 3);
  },

  onMoving: function(e, diff, group){
    var me = this;
    me.updateLines(group, diff, me);
  },

  onScaling: function(e) {
    var me = this;
    me.updateLines();
  },

  onMoved: function(group) {
    var me = this;
    var map = me.canvas.map;
    return map.notifyMoved(me.id, {
      left: me.left + (group ? group.oCoords.mt.x: 0),
      top: me.top + (group ? group.oCoords.ml.y: 0),
      width: me.width * me.scaleX,
      height: me.height * me.scaleY,
    }, null, null, me.data ? me.data.fatherid : 0);
  },

  onEditStateChange: function(editable){
    var me = this;
    me.selectable = editable;
  },

  getConnectionPoint: function(point, group) {
    return mapObject.getConnectionPoint(this, point, group);
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
      text: config.text || '',
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

fabric.BiGauge.create = function(options){
  var defaults = {
    id: 0,

    objectType: MapItemType.BI,
    objectSubType: MapItemType.BIGauge,
    text: '',

    fontSize: 50 / 3,
    fontFamily: "Arial",

    lines: [],
    canvas: null,
    hasRotatingPoint: false,
  };

  var config = $.extend({}, defaults, options);

  var deviceObj = new fabric.BiGauge({});

  deviceObj.set(config);
  deviceObj.setSrc(config.imageUrl, function(){
    deviceObj.onEditStateChange(config.canvas.map.editable);
    config.canvas.map.refinePosition(deviceObj);
    config.canvas.add(deviceObj);
  }, {crossOrigin: 'anonymous'});

  return deviceObj;
};