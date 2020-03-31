fabric.DropRect = fabric.util.createClass(fabric.Rect, {
  initialize: function (options) {
    options || (options = {});
    this.callSuper('initialize', options);
    this.set({
      points: [],
      pointRadius: 5,
      fill: 'transparent',
      stroke: 'rgb(102,153,255)',

      nearPoint: 0,
      nearObject: null,
      nearPos: {},
    });
  },

  createPoint: function() {
    var me = this;
    var obj;

    obj = new fabric.DropRectPoint({
      radius: me.pointRadius,
      rectObj: me,
    });

    me.canvas.add(obj);
    return obj;
  },

  showFor: function(obj, hub, p) {
    var me = this;
    var map = me.canvas.map;

    var dropObj = obj.dropObj ? obj.dropObj() : obj;

    var offset = me.canvas.map.getPanOffset();
    var z = me.canvas.getZoom();
    me.setAngle(dropObj.getAngle());

    me.left = dropObj.left;
    me.top = dropObj.top;
    me.width = dropObj.width;
    me.height = dropObj.height;
    me.scaleX = dropObj.scaleX;
    me.scaleY = dropObj.scaleY;
    me.visible = true;
    me.setCoords();
    me.canvas.renderAll();

    me.nearPoint = -1;
    me.nearObject = obj;

    var count = hub ? map.hubPoints.length :
      map.devicePoints.length;
    for(var i = 0; i < count; i++) {
      var pos = map.getConnectionPoint(dropObj, i, false, hub);
      if(!me.points[i]) {
        me.points[i] = me.createPoint();
      }

      var isNear = Math.abs(p.x - pos.x) < me.pointRadius &&
        Math.abs(p.y - pos.y) < me.pointRadius && me.nearPoint < 0;

      if(isNear) {
        me.nearPoint = i;
        me.nearPos = pos;
      }

      me.points[i].set({
        left: pos.x,
        top: pos.y,
        width: me.pointRadius,
        height: me.pointRadius,
        visible: true,

        stroke: isNear ? '#F02020' : 'rgb(102,153,255)'
      });
      me.points[i].setCoords();
    }
  },

  hide: function(){
    var me = this;

    me.visible = false;
    $.each(me.points, function(i, point){
      point.visible = false;
    });
  },

  onMouseDownPoint: function(pointObj, o) {
    var me = this;
    var map = me.canvas.map;
  },
});
