var MapItemType = {
  Device: 'device',
  BI: 'bi',
  Shape: 'shape',

  DeviceImage: 'device-image',
  DeviceLabel: 'device-label',

  BIGauge: 'bi-gauge',
  BIPieChart: 'bi-piechart',
  BILineChart: 'bi-linechart',
  BIBarChart: 'bi-barchart',

  ShapeHub: 'shape-hub',
  ShapeLineGroup: 'shape-line-group',
  ShapeLine: 'shape-line',
  ShapeLineHandle: 'shape-line-handle',

  ShapeLightning: 'shape-lightning',
  ShapeLightningHandle: 'shape-lightning-handle',

  ShapeText: 'shape-text',
}
var templine = false;
var mapObject = {
  canvas: null,
  objects: [],
  connectors: [],
  selObj: null,

  editable: true,
  hidden: false,

  selRect: null,
  selLine: null,
  selText: null,
  zoomRect: null,

  highlightRect: null,
  highlightLine: null,

  listener: null,

  movingObject: null,
  loading: 0,
  hoverObject: null,
  lastX: 0,
  lastY: 0,
  lastSX: 1,
  lastSY: 1,
  lastPoint: null,
  mouseOffsetX: 0,
  mouseOffsetY: 0,
  isMouseDown: false,

  lastMouseEvent: null,

  animInterval: 0,
  trafficVisible: true,

  timerTextChange: 0,

  pan: null,
  zooming: false,
  editableBeforeZoom: false,

  destroyed: false,

  initialize: function(options){
    var me = this;
    me.options = options;

    me.initCanvas();
    me.initCanvasEvents();

    me.onSelectionCleared();

    if(me.trafficVisible) me.starLineAnim();
  },

  render: function(){
    var me = this;
    me.canvas.renderAll();
    if (me.destroyed || me.loading < 1) return;
    fabric.util.requestAnimFrame(me.render.bind(me));
  },

  initCanvas: function() {
    var me = this;
    var options = me.options;

    fabric.StaticCanvas.prototype.imageSmoothingEnabled = true;
    var canvas = new fabric.Canvas(options.canvas);

    me.editable = options.editable;
    me.listener = options.listener;
    me.trafficVisible = options.trafficVisible;

    canvas.selection = me.editable;

    canvas.renderOnAddRemove = false;

    canvas.map = me;
    me.canvas = canvas;

    //Drop Rect
    me.selRect = new fabric.DropRect({
      canvas: me.canvas,
      visible: false,
    });
    canvas.add(me.selRect);

    //Highlight Rect
    me.highlightRect = new fabric.Rect({
      visible: false,
      selectable: false,
    });
    me.highlightLine = fabric.ShapeLine.create({
      canvas: me.canvas,
      strokeDashArray: [2, 2],
    });

    //Conneciton Line
    me.selLine = new fabric.ShapeLine.create({
      canvas: me.canvas,
    });
    //Cursor
    canvas.moveCursor = 'default';

    //Zoom Rect
    me.zoomRect = new fabric.Rect({
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      fill: 'rgba(51,150,51,0.7)',
      visible: false,
    });
    canvas.add(me.zoomRect);
  },

  initCanvasEvents: function() {
    var me = this;
    var canvas = me.canvas;

    canvas.on('selection:created',function(ev){
      if (!me.editable) return;

      var obj = ev.target;
      obj.set({
        lockScalingX: true,
        lockScalingY: true,
        hasRotatingPoint: false,
        hasControls: false,
      });

      var objects = obj.getObjects();
      var removes = [];
      var i;
      for(i = 0; i< objects.length; i++) {
        var object = objects[i];
        if(object.objectSubType == MapItemType.ShapeLightning ||
          object.objectSubType == MapItemType.ShapeLine) {
          removes.push(object);
        }
      }


      //Tweak
      if (removes.length > 0) {
        for (i = 0; i < removes.length; i++) {
          var object = removes[i];
          obj._moveFlippedObject(object);
        }

        obj._restoreObjectsState();
        obj.forEachObject(obj._setObjectActive, obj);

        for (i = 0; i < removes.length; i++) {
          var object = removes[i];
          obj.remove(object);
        }

        obj._calcBounds();
        obj._updateObjectsCoords();
      }

      if(objects.length == 0) {
        me.onSelectionCleared(ev);
      }

      me.lastX = obj.left;
      me.lastY = obj.top;
      me.lastSX = obj.scaleX;
      me.lastSY = obj.scaleY;
    });

    canvas.on('object:selected', function(e){
      me.onObjectSelected(e);

    });
    canvas.on('selection:cleared', function(e){
      me.onSelectionCleared(e);
    });
    canvas.on('object:moving', function(e){
      me.onObjectMoving(e);
    });
    canvas.on('object:scaling', function(e){
      me.onObjectScaling(e);
    });

    canvas.on('mouse:move', function(e){
      me.onMouseMove(e);
    });
    canvas.on('mouse:over', function(e){
      me.onMouseOver(e);
    });
    canvas.on('mouse:out', function(e){
      me.onMouseOut(e);
    });
    canvas.on('mouse:down', function(e){
      me.onMouseDown(e);
    });
    canvas.on('mouse:up', function(e){
      me.onMouseUp(e);
    });

    canvas.on('text:editing:entered', function(e) {
      me.onEditingEntered(e);
    });

    canvas.on('text:editing:exited', function(e) {
      me.onEditingExited(e);
    });

    canvas.on('text:changed', function(e) {
      me.onTextChanged(e);
    })
  },

  refinePosition: function(obj) {
    var me = this;

    if (!obj) return;

    obj.left = Math.ceil(obj.left);
    obj.top = Math.ceil(obj.top);

    obj.setCoords();
  },

  onObjectSelected: function (e) {
    var me = this;
    var selObj = e.target;
    var canvas = me.canvas;
    var listener = me.listener;

    me.selRect.hide();



    if(me.selObj && me.selObj != selObj && me.selObj.onSelectionCleared) {
      me.selObj.onSelectionCleared({});
    }
    me.selObj = null;

    if (!me.editable) return;

    me.selObj = selObj;

    if (selObj && selObj.onSelected) {
      selObj.onSelected(e);
    }

    me.lastX = selObj.left;
    me.lastY = selObj.top;
    me.lastSX = selObj.scaleX;
    me.lastSY = selObj.scaleY;

    canvas.renderAll();

    if(listener && listener.onObjectSelected) {
      listener.onObjectSelected(me, selObj);
    }

    console.log(selObj);
  },

  onSelectionCleared: function (e) {
    var me = this;
    var selObj = me.selObj;
    var canvas = me.canvas;
    var listener = me.listener;

    if (selObj && selObj.onSelectionCleared) {
      selObj.onSelectionCleared(e);
      canvas.renderAll();
    }

    if(selObj && selObj.getObjects && !selObj.objectSubType) {

    }

    me.selObj = null;

    if(listener && listener.onSelectionCleared) {
      listener.onSelectionCleared(me);
    }
  },

  onObjectMoving: function (e) {
    var me = this;
    var canvas = me.canvas;

    var obj = e.target;
    if (!obj) return;

    var listener = me.listener;
    me.movingObject = obj;
    me.refinePosition(obj);

    var diff = {
      x: obj.left - me.lastX,
      y: obj.top - me.lastY,
    };

    obj.setCoords();
    obj.onMoving && obj.onMoving(e, diff, false);

    if(obj.getObjects && !obj.objectSubType) {
      var objects = obj.getObjects();
      $.each(objects, function(i, item){
        item.left = Math.ceil(item.left);
        item.top = Math.ceil(item.top);
        item.setCoords();
        item.onMoving && item.onMoving(e, diff, obj);
      });
    }

    canvas.renderAll();

    me.lastX = obj.left;
    me.lastY = obj.top;

    //////////////////////////////////////////////////////////////////////////////////////

    if(obj && obj.objectSubType == MapItemType.ShapeLineHandle) return;
    if(obj.getObjects && !obj.objectSubType) return;

    if(listener && listener.onObjectMoving) {
      listener.onObjectMoving(me, obj, e.e);
    }
  },

  onObjectScaling: function (e) {
    var me = this;
    var canvas = me.canvas;
    var obj = e.target;
    if (!obj) return;

    if (!me.editable) {
      obj.scaleX = me.lastSX;
      obj.scaleY = me.lastSY;
      me.canvas.renderAll();
      return;
    }

    obj.setCoords();

    var diff = {
      width: obj.width * (obj.scaleX - me.lastSX),
      height: obj.height * (obj.scaleY - me.lastSY),
    };

    me.movingObject = obj;
    obj.onScaling && obj.onScaling(e, diff);

    me.lastSX = obj.scaleX;
    me.lastSY = obj.scaleY;
  },

  onMouseOver: function(e) {
    var me = this;
    if (me.zooming) return;

    var obj = e.target;
    me.hoverObject = null;
    if (!obj) return;
    obj = me.getSelected(obj);
    me.hoverObject = obj;
    obj && me.listener.onMouseOver
    && me.listener.onMouseOver(me, obj);
  },

  onMouseOut: function(e) {
    var me = this;
    if (me.zooming) return;

    var obj = e.target;
    if (!obj) return;

    obj = me.getSelected(obj);
    if (obj == me.hoverObject) {
      me.listener &&
      me.listener.onMouseOut
      && me.listener.onMouseOut(me);

      me.hoverObject = null;
    }
  },

  onMouseDown: function(e) {
    var me = this;
    var mouse = me.canvas.getPointer(e.e);

    me.lastMouseEvent = e;

    me.isMouseDown = true;
    me.movingObject = null;

    me.mouseOffsetX = 0;
    me.mouseOffsetY = 0;

    if (me.zooming) {
      me.zoomRect.startX = mouse.x;
      me.zoomRect.startY = mouse.y;

      me.canvas.bringToFront(me.zoomRect);
      me.canvas.renderAll();
    } else {
      me.lastPoint = me.canvas.getPointer(e.e);

      var obj = e.target;
      if(!obj) return;

      me.mouseOffsetX = mouse.x - obj.left;
      me.mouseOffsetY = mouse.y - obj.top;

      if(me.editable) {
        obj.onMouseDown && obj.onMouseDown(e);
      } else {

        var deviceObj;
        if (MapItemType.DeviceImage == obj.objectSubType ||
          MapItemType.DeviceLabel == obj.objectSubType) {
          deviceObj = obj.deviceObj;
        } else if (MapItemType.BIGauge == obj.objectSubType) {
          deviceObj = obj;
        }

        deviceObj
        && me.listener.onMouseDown
        && me.listener.onMouseDown(me, deviceObj);
      }
    }
  },

  onMouseMove: function(o) {
    var me = this;

    me.lastMouseEvent = o;

    if (me.zooming) {
      if (o.e.which != 1) return;
      var mouse = me.canvas.getPointer(o.e);
      me.zoomRect.visible = true;

      me.zoomRect.left = Math.min(me.zoomRect.startX, mouse.x);
      me.zoomRect.top = Math.min(me.zoomRect.startY, mouse.y);
      me.zoomRect.width = Math.abs(me.zoomRect.startX - mouse.x);
      me.zoomRect.height = Math.abs(me.zoomRect.startY - mouse.y);
      me.canvas.renderAll();
    } else {
      var obj = o.target;
      if(me.editable) {
        if(o.e.which == 0 && me.canvas.selection) {
          var p = me.canvas.getPointer(o.e);
          me.showNearestObject(p, obj);
          if(me.selRect.visible && me.selRect.nearPoint >= 0) {
            me.startNewLine(me.selRect.nearObject, me.selRect.nearPoint);
          } else {
            me.clearNewLine();
          }
          me.canvas.renderAll();
        }

        obj && obj.onMouseMove && obj.onMouseMove(e);
      } else {
        if (me.canvas.getZoom() > 1) {
          if(me.isMouseDown) {
            var pt = me.canvas.getPointer(o.e);
            var diff = {
              x: pt.x - me.lastPoint.x,
              y: pt.y - me.lastPoint.y,
            };
            if (!me.pan) {
              me.pan = {
                x: 0,
                y: 0,
              }
            }

            var c = me.canvas;
            var z = c.getZoom();
            me.pan.x -= diff.x / z;
            me.pan.y -= diff.y / z;
            var p = {
              x: me.pan.x * z - c.width / 2,
              y: me.pan.y * z - c.height / 2,
            };

            c.absolutePan(p);
          }

          me.canvas.setCursor('pointer');
        } else {
          obj && me.canvas.setCursor('pointer');
        }
      }
    }
  },

  onMouseUp: function (e) {
    var me = this;

    me.lastMouseEvent = e;

    if (!me.isMouseDown) {
      return;
    }

    me.isMouseDown = false;
    if (me.zooming) {
      me.zoomRect.visible = false;
      if (me.zoomRect.width < 50 || me.zoomRect.height < 50) {
        showAlert("Too small area.");
      } else {
        var px = me.canvas.width / me.zoomRect.width;
        var py = me.canvas.height / me.zoomRect.height;

        var z = Math.min(px, py);

        me.changeZoom(z, {
          x: me.zoomRect.left + me.zoomRect.width / 2,
          y: me.zoomRect.top + me.zoomRect.height / 2,
        });

        me.canvas.renderAll();

        me.listener.onZoomRect &&
        me.listener.onZoomRect();
      }
    } else {
      var obj = e.target;
      if (!me.canvas.getActiveObject() && !me.canvas.getActiveGroup())
        obj = null;

      obj && obj.onMouseUp && obj.onMouseUp(e);

      if(obj && me.movingObject
        && obj.objectSubType != MapItemType.ShapeLineHandle
        && obj.objectSubType != MapItemType.ShapeLightningHandle) {
        obj.setCoords();

        var groupObj = null;
        var p = me.canvas.getPointer(e.e);
        groupObj = me.findNearestObject(p, obj, function(dropObj){
          return dropObj.objectType.toLowerCase() == 'device' && dropObj.deviceObj
            && dropObj.deviceObj.data.type && dropObj.deviceObj.data.type.toLowerCase() == 'group';
        });

        //If dragging a device into a group
        if (groupObj) {

          var objects = [];
          if (obj.getObjects) {

            $.each(obj.getObjects(), function(i, item){
              if (item.objectType == MapItemType.Device) {
                if (objects.indexOf(item.deviceObj) < 0)
                  objects.push(item.deviceObj);
              } else {
                objects.push(item);
              }
            });
          } else {
            if (obj.objectType == MapItemType.Device) objects.push(obj.deviceObj);
            else objects.push(obj);
          }


          var startX = 0;
          var startY = 0;
          $.each(objects, function(i, item) {
            if (item.objectType == MapItemType.Device) {
              startX = Math.min(item.imageObj.left, startX);
              startX = Math.min(item.labelObj.left, startX);

              startY = Math.min(item.imageObj.top, startY);
              startY = Math.min(item.labelObj.top, startY);
            } else {
              startX = Math.min(item.left, startX);
              startY = Math.min(item.top, startY);
            }
          });


          var requests = [];
          $.each(objects, function(i, item){

            var deviceObj = item;
            if (item.objectType == MapItemType.Device) {

              //Change Position
              var offsetX = 0;
              var offsetY = deviceObj.imageObj.height * deviceObj.imageObj.scaleY + 15;

              deviceObj.imageObj.left = deviceObj.imageObj.left - startX + 100;
              deviceObj.imageObj.top =  deviceObj.imageObj.top - startY + 100;
              deviceObj.labelObj.left = deviceObj.imageObj.left + offsetX;
              deviceObj.labelObj.top = deviceObj.imageObj.top + offsetY;

              deviceObj.data.groupid = groupObj.data.id;
              //Now Move
              if (deviceObj.onLabelObjMoved) {
                var req = deviceObj.onLabelObjMoved(null);
                requests.push(req);
              }

            } else {
              deviceObj.left = deviceObj.left - startX + 100;
              deviceObj.top = deviceObj.top - startY + 100;

              deviceObj.data.groupid = groupObj.data.id;
              //Now Move
              if (deviceObj.onMoved) {
                var req = deviceObj.onMoved();
                requests.push(req);
              }
            }

            //Remove Device
            deviceObj.remove();
          });

          me.canvas.deactivateAll();


          $.when.apply(this, requests).done(function(){
            me.listener.onMouseDown && me.listener.onMouseDown(me, groupObj);
          });
        } else {
          if(obj.objectType) {
            obj.onMoved && obj.onMoved();
          } else if(obj.getObjects) {
            var objects = obj.getObjects();
            $.each(objects, function(i, item){
              item.onMoved && item.onMoved(obj);
            });
          }
        }
      }
      me.movingObject = null;
    }
  },

  onEditingEntered: function(e) {
    var me = this;
    me.selText = e.target.text;
  },

  onEditingExited: function(e) {
    var me = this;
    var text = e.target.text;

    clearTimeout(me.timerTextChange);

    if(me.selText != text || me.timerTextChange) {
      e.target.onTextChanged &&
      e.target.onTextChanged();
    }

    me.timerTextChange = 0;
  },

  onTextChanged: function(e) {
    var me = this;
    var target = e.target;

    clearTimeout(me.timerTextChange);
    me.timerTextChange = setTimeout(function() {
      target.onTextChanged &&
      target.onTextChanged();
    }, 200);
  },

  ///////////////////////////////////////////////////////
  notifyMoved: function(id, pos, text, type, fatherid) {
    var me = this;
    if(!id) return true;

    pos = pos || {};
    text = text || {};

    if (!me.listener.onObjectMoved) return true;

    var obj = me.findObject(id);
    var props = $.extend(obj.data, {
      x: parseInt(pos.left || 10),
      y: parseInt(pos.top || 10),
      width: parseInt(pos.width || 50),
      height: parseInt(pos.height || 50),
      angle: pos.angle || 0,
      align: text.align || 'left',
      textX: parseInt(text.left || 0),
      textY: parseInt(text.top || 0),
      textSize: text.size || 13,
      textWidth: parseInt(text.width || 50),
    });

    return me.listener.onObjectMoved(me, props, type);
  },

  notifyLineUpdate: function(lineObj) {
    var me = this;
    if(!lineObj) return;
    me.listener.onLineUpdate &&
    me.listener.onLineUpdate(lineObj);
  },

  notifyLineStyleChange: function(lineObj, style) {
    var me = this;
    if(!lineObj) return;
    me.listener.onLineStyleChange &&
    me.listener.onLineStyleChange(lineObj, style);
  },

  notifyTextChanged: function(id, text, isLabel) {
    var me = this;

    var obj = me.findObject(id);
    var props = $.extend(obj.data, {
      name: text
    });

    me.listener.onTextChanged &&
    me.listener.onTextChanged(me, props, isLabel);
  },

  ////////////////////////////////////////////////////////

  addUploading: function(id) {
    var me = this;
    var obj = me.findObject(id);
    obj && obj.addUploading && obj.addUploading();

    me.loading++;

    if (me.loading == 1) {
      me.render();
    }
  },

  removeUploading: function(id) {
    var me = this;
    var obj = me.findObject(id);
    obj && obj.removeUploading && obj.removeUploading();

    me.loading--;
    if(me.loading < 0) me.loading = 0;
  },

  ////////////////////////////////////////////////////////

  getSelected: function(sel) {
    var me = this;
    var object;

    if (sel) object = sel;
    else if(me.selObj) object = me.selObj;
    else return null;

    var subtype = object.objectSubType;
    if(MapItemType.ShapeLineHandle == subtype) {
      object = object.line.line;
    } else if(MapItemType.ShapeLine == subtype) {
      object = object.line;
    } else if(MapItemType.ShapeLightningHandle == subtype) {
      object = object.lightning;
    } else if(MapItemType.DeviceImage == subtype){
      object = object.deviceObj;
    } else if(MapItemType.DeviceLabel == subtype){
      object = object.deviceObj;
    }

    if(!object.objectType) return null;

    return object;
  },

  selectedLonghub: function(){
    var me = this;
    var object = me.getSelected();
    if (!object) return false;
    if (object.objectSubType != MapItemType.ShapeHub) return false;
    return object;
  },

  ////////////////////////////////////////////////////////

  rotateObject: function(right) {
    var me = this;
    var object = me.selectedLonghub();
    if (!object) return;
    object.rotate(right == true);
  },

  ////////////////////////////////////////////////////////

  findObject: function(id) {
    var me = this;
    var found = null;
    $.each(me.objects, function(i, object){
      if(object.id == id) {
        found = object;
        return false;
      }
    });

    return found;
  },

  findConnector: function(id, fromDeviceid, fromPoint, toDeviceid, toPoint) {
    var me = this;
    var found = null;
    $.each(me.connectors, function(i, item){
      if (id) {
        if(item.id == id) {
          found = item;
          return false;
        }
      } else {
        if (item.startObj.id == fromDeviceid
          && item.startPoint == fromPoint
          && item.endObj.id == toDeviceid
          && item.endPoint == toPoint) {
          found = item;
          return false;
        }
      }
    });

    return found;
  },

  ////////////////////////////////////////////////////////

  findNearestObject: function(p, hoverObj, filter) {
    var me = this;
    var nearestObj;
    var pointRadius = me.selRect.pointRadius;
    var group = me.canvas.getActiveGroup();
    var groupObjs = [];
    group && (groupObjs = group.getObjects());
    $.each(me.objects, function(i, object){
      var dropObj = object;

      if(object.dropObj) {
        dropObj = object.dropObj();
      }

      if (dropObj == me.movingObject) return;
      if (groupObjs.indexOf(dropObj) >= 0) return;
      if (filter && filter(dropObj) == false) return;
      if (dropObj.getAngle()) {
        var r = dropObj.getBoundingRect();
        var offset = me.canvas.map.getPanOffset();
        var z = me.canvas.getZoom();

        var w = dropObj.width * dropObj.scaleX;
        var h = dropObj.height * dropObj.scaleY;
        var cx = (r.left + r.width / 2  + offset.x) / z;
        var cy = (r.top + r.height / 2  + offset.y) / z;

        var d = Math.sqrt((cy - p.y) * (cy - p.y) + (cx - p.x) * (cx - p.x));
        var a = Math.atan2(cy - p.y, p.x - cx) + dropObj.getAngle() * Math.PI / 180;

        var c = {
          x: cx + Math.cos(a) * d,
          y: cy + Math.sin(a) * d,
        };

        var dropRect = {
          left: cx - w / 2 - pointRadius,
          top: cy - h / 2 - pointRadius,
          right: cx + w / 2 + pointRadius,
          bottom: cy + h / 2 + pointRadius
        };

        if(c.x >= dropRect.left && c.x <= dropRect.right &&
          c.y >= dropRect.top && c.y <= dropRect.bottom) {
          nearestObj = object;
          return false;
        }

      } else {
        var dropRect = {
          left: dropObj.left - pointRadius,
          top: dropObj.top - pointRadius,
          width: dropObj.width * dropObj.scaleX + pointRadius * 2,
          height: dropObj.height * dropObj.scaleY + pointRadius * 2,
        };


        if(p.x >= dropRect.left && p.x <= dropRect.left + dropRect.width &&
          p.y >= dropRect.top && p.y <= dropRect.top + dropRect.height) {
          nearestObj = object;
          return false;
        }
      }

    });

    return nearestObj;
  },

  showNearestObject: function(p, hoverObj){
    var me = this;
    var nearestObj = me.findNearestObject(p, hoverObj);

    me.selRect.hide();
    if(nearestObj) {
      var dropObj = nearestObj.dropObj ?
        nearestObj.dropObj() : nearestObj;
      if(dropObj != me.selObj) {
        var hub = nearestObj.objectSubType == MapItemType.ShapeHub;

        me.selRect.showFor(nearestObj, hub, p);
      }
    }
  },
  //////////////////////////////////////////////////////

  startNewLine: function(object, point) {
    var me = this;

    var hasPoint = false;
    $.each(object.lines, function(i, line) {
      hasPoint = line.hasPoint(object, point) && line.handleVisible();
      if (hasPoint) return false;
    });

    if(hasPoint) {
      me.clearNewLine();
      return;
    }

    me.selLine.startObj = object;
    me.selLine.startPoint = point;
    me.selLine.updatePosition();
    me.selLine.showHandles(true);
  },

  clearNewLine: function() {
    var me = this;
    if(!me.selLine.startObj) return;
    me.selLine.startObj = null;
    me.selLine.startPoint = 0;
    me.selLine.updatePosition();
    me.selLine.showHandles(false);
  },

  addNewLine: function(startObj, startPoint, endObj, endPoint){
    var me = this;
    me.clearNewLine();
    if (startObj == endObj && startPoint == endPoint) {
      me.canvas.renderAll();
      return;
    }

    var lineObj = me.addShapeLine({
      startObj: startObj,
      startPoint: startPoint,
      endObj: endObj,
      endPoint: endPoint,
    });

    me.canvas.renderAll();

    me.notifyLineUpdate(lineObj);
  },

  //////////////////////////////////////////////////////
  addDevice: function(o, c) {

    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var device = new fabric.Device.create(config, c);
    me.objects.push(device);
    return device;
  },

  addBiGauge: function(o) {
    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var gauge = new fabric.BiGauge.create(config);
    me.objects.push(gauge);
    return gauge;
  },
  addTempGauge: function(o){
    var me = this;
    jQuery('.tempgauge').tempGauge({width:40, borderWidth:3, showLabel:true,canvas: me.canvas});
    return gauge;
  },
  addShapeLine: function(o) {
    var me = this;

    var startObj = (typeof o.startObj == 'object') ?
      o.startObj: me.findObject(o.startObj);
    var endObj = (typeof o.endObj == 'object') ?
      o.endObj: me.findObject(o.endObj);

    if(!startObj || !endObj) return;

    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
      startObj: startObj,
      endObj: endObj,
      lineType: o.lineType,
    });

    if (config.lineType == 'dashed') {
      config.strokeDashArray = [5, 5];
    }

    var line = new fabric.ShapeLine.create(config);
    startObj.lines.push(line);
    endObj.lines.push(line);

    me.connectors.push(line);

    if (startObj.objectSubType == MapItemType.ShapeHub &&
      endObj.objectSubType != MapItemType.ShapeHub) {

      line.addAnim(false);
    } else if(endObj.objectSubType == MapItemType.ShapeHub &&
      startObj.objectSubType != MapItemType.ShapeHub){
      if (!templine) {
        templine = true;
        line.addAnim(true, '#f55');
      } else {
        line.addAnim(true);
      }

    } else {
      line.addAnim(true);
    }

    return line;
  },

  addShapeHub: function(o) {
    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var hub = new fabric.ShapeHub.create(config);
    me.objects.push(hub);
    return hub;
  },

  addShapeLightning: function(o) {
    var me = this;

    var startObj = (typeof o.startObj == 'object') ?
      o.startObj: me.findObject(o.startObj);
    var endObj = (typeof o.endObj == 'object') ?
      o.endObj: me.findObject(o.endObj);

    if(!startObj || !endObj) return;

    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
      startObj: startObj,
      endObj: endObj,
    });


    var line = new fabric.ShapeLightning.create(config);
    startObj.lines.push(line);
    endObj.lines.push(line);

    me.connectors.push(line);

    return line;
  },

  addBiBarChart: function(o) {
    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var chart = new fabric.BiBarChart.create(config);
    me.objects.push(chart);
    return chart;
  },

  addBiLineChart: function(o) {
    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var chart = new fabric.BiLineChart.create(config);
    me.objects.push(chart);
    return chart;
  },

  addBiPieChart: function(o) {
    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var chart = new fabric.BiPieChart.create(config);
    me.objects.push(chart);
    return chart;
  },

  addShapeText: function(o) {
    var me = this;
    var config = $.extend(true, {}, o, {
      canvas: me.canvas,
    });
    var chart = new fabric.ShapeText.create(config);
    me.objects.push(chart);
    return chart;
  },

  /////////////////////////////////////////////////////////////
  setEditable: function(editable) {
    var me = this;
    editable = editable == true;

    me.canvas.selection = editable;

    if(!editable) {

      if (me.isMouseDown) {
        me.lastMouseEvent.target = me.movingObject;
        me.movingObject.scalingX = false;
        me.movingObject.scalingY = false;
        me.onMouseUp(me.lastMouseEvent);
      }

      me.clearNewLine();
      me.selRect.hide();
      me.canvas.fire('selection:cleared');
      me.canvas.deactivateAll().renderAll();
    }

    $.each(me.objects, function(i, object){
      object.onEditStateChange
      && object.onEditStateChange(editable);
    });

    $.each(me.connectors, function(i, object){
      object.onEditStateChange
      && object.onEditStateChange(editable);
    });

    if (editable) me.stopLineAnim();
    else if(me.trafficVisible) me.starLineAnim();

    me.editable = editable;
    me.canvas.renderAll();
  },

  setHidden: function(hidden) {
    var me = this;
    me.hidden = hidden;
    if (hidden) {
      me.stopLineAnim();
    } else {
      if (!me.editable && me.trafficVisible) {
        me.starLineAnim();
      }
    }
  },

  showHighlightRect: function(deviceObj, labelObj, show) {
    var me = this;
    if(show) {
      me.highlightLine.set({
        startObj: deviceObj,
        startPoint: -1,
        endObj: labelObj,
        endPoint: -1,
      });

      deviceObj.lines.push(me.highlightLine);
      labelObj.lines.push(me.highlightLine);
    } else {
      me.highlightLine.set({
        startObj: null,
        startPoint: 0,
        endObj: null,
        endPoint: 0,
      });

      var index = deviceObj.lines.indexOf(me.highlightLine);
      if(index >= 0) deviceObj.lines.splice(index, 1);

      index = labelObj.lines.indexOf(me.highlightLine);
      if(index >= 0) labelObj.lines.splice(index, 1);
    }

    me.highlightLine.updatePosition();
  },

  /////////////////////////////////////////////////////////////

  setTrafficVisible: function(visible) {
    var me = this;
    me.trafficVisible = visible;
    if (!visible) {
      me.stopLineAnim();
    } else if(!me.editable) {
      me.starLineAnim();
    }
  },

  /////////////////////////////////////////////////////////////
  changeConnectorType: function(linetype, imageUrl, line, extra) {
    var me = this;

    line = line || me.selectedLine();
    if(!line) return;
    if(line.objectSubType == MapItemType.ShapeLightning && line.imageUrl == imageUrl) return;
    if(line.objectSubType == MapItemType.ShapeLineGroup && line.linetype == linetype) return;

    var config = $.extend({
      id: line.id,
      startObj: line.startObj,
      endObj: line.endObj,
      startPoint: line.startPoint,
      endPoint: line.endPoint,
      canvas: me.canvas,
      imageUrl: imageUrl,
      lineType: linetype,
    }, extra);

    line.remove();

    var newline;

    if((linetype == 'lightning2' || linetype == 'lightning') && imageUrl) {
      newline = me.addShapeLightning(config);
    } else {
      newline = me.addShapeLine(config);
    }

    return config.id;
  },

  selectedLine: function() {
    var me = this;
    if(!me.selObj) return false;

    var line = false;
    if(me.selObj.objectSubType == MapItemType.ShapeLineHandle) {
      line = me.selObj.line.line;
    } else if(me.selObj.objectSubType == MapItemType.ShapeLine) {
      line = me.selObj.line;
    } else if(me.selObj.objectSubType == MapItemType.ShapeLightningHandle) {
      line = me.selObj.lightning;
    } else if(me.selObj.objectSubType == MapItemType.ShapeLightning) {
      line = me.selObj;
    } else {
      return false;
    }

    return line;
  },

  changeStrokeWidth: function(increase) {
    var me = this;
    var line = me.selectedLine();

    if(line.objectSubType != MapItemType.ShapeLineGroup) return;

    line.changeStrokeWidth(increase);
  },

  changeStrokeColor: function(color) {
    var me = this;
    var line = me.selectedLine();

    if(line.objectSubType != MapItemType.ShapeLineGroup) return;

    line.changeStrokeColor(color);
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////

  changeFontSize: function(increase) {
    var me = this;
    var textObj = me.selectedText();

    textObj && textObj.changeFontSize(increase);
  },

  changeAlign: function(align) {
    var me = this;
    var textObj = me.selectedText();

    textObj && textObj.changeAlign(align);
    me.canvas.renderAll();
  },

  selectedText: function() {
    var me = this;
    if(!me.selObj) return false;

    var textObj = false;
    if(me.selObj.objectSubType == MapItemType.DeviceLabel) {
      textObj = me.selObj.deviceObj;
    } else if(me.selObj.objectSubType == MapItemType.ShapeText) {
      textObj = me.selObj;
    } else {
      return false;
    }

    return textObj;
  },
  /////////////////////////////////////////////////////////////

  setZooming: function(zooming) {
    var me = this;
    me.canvas.deactivateAllWithDispatch();

    me.zooming = zooming;

    if (zooming) {
      me.editableBeforeZoom = me.editable;
      if (me.editable) {
        me.setEditable(false);
      }
    } else {
      me.setEditable(me.editableBeforeZoom);
    }
  },

  /////////////////////////////////////////////////////////////

  zoomIn: function() {
    var me = this;
    var c = me.canvas;
    var z = c.getZoom();
    if (z >= 4) return;
    z += 0.1;

    me.changeZoom(z);
  },

  zoomOut: function() {
    var me = this;
    var c = me.canvas;
    var z = c.getZoom();
    if (z < 0.2) return;
    z -= 0.1;

    if (z <= 1 && z + 0.1 > 1) me.zoomReset();
    me.changeZoom(z);
  },

  zoomReset2: function (devices) {
    var me = this;
    var left = 0, top = 0;
    var right = 100, bottom = 100;

    me.canvas.deactivateAllWithDispatch();
    me.canvas.setZoom(1);
    me.canvas.absolutePan({x: 0, y: 0});

    var updateBounding = function(br, first) {
      if (first) {
        left = br.left;
        top = br.top;
        right = br.left + br.width;
        bottom = br.top + br.height;
      } else {
        left = Math.min(br.left, left);
        top = Math.min(br.top, top);
        right = Math.max(br.left + br.width, right);
        bottom = Math.max(br.top + br.height, bottom);
      }
    }

    var i;
    for (i = 0; i < devices.length; i++){
      var obj = devices[i];
      updateBounding({
        left: obj.x || 0,
        top: (obj.y || 0) - 6,
        width: (obj.width || 50) + 12,
        height: obj.height || 50
      }, i == 0);
      if (obj.textSize && obj.textX && obj.textY) {
        updateBounding({
          left: obj.textX,
          top: obj.textY,
          width: obj.textWidth,
          height: obj.textSize + 4
        });
      }
    }

    var w = right - left;
    var h = bottom - top;

    if (w < 800) {
      left += w / 2;
      w = 800;
      left -= w / 2;
    }
    if (h < 500) {
      top += h / 2;
      h = 500;
      top -= h / 2;
    }

    var px = (me.canvas.width - 20) / w;
    var py = (me.canvas.height - 20) / h;

    var z = Math.min(px, py);

    if (z > 1 && z < 1.5) z = 1
    if (z > 3) z = 3;

    me.changeZoom(z, {
      x: left + w / 2,
      y: top + h / 2,
    });
  },

  zoomReset: function() {
    var me = this;
    var left = 0, top = 0;
    var right = 100, bottom = 100;

    if (!me.objects.length) return;

    me.canvas.deactivateAllWithDispatch();
    me.canvas.setZoom(1);
    me.canvas.absolutePan({x: 0, y: 0});

    var updateBounding = function(obj, first) {
      var br = obj.getBoundingRect();

      if (first) {
        left = br.left;
        top = br.top - 6;
        right = br.left + br.width + 12;
        bottom = br.top + br.height;
      } else {
        left = Math.min(br.left, left);
        top = Math.min(br.top - 6, top);
        right = Math.max(br.left + br.width + 12, right);
        bottom = Math.max(br.top + br.height, bottom);
      }
    }

    var i;
    for (i = 0; i < me.objects.length; i++){
      var obj = me.objects[i];
      if (obj.objectType == MapItemType.Device) {
        updateBounding(obj.imageObj, i == 0);
        updateBounding(obj.labelObj);

      } else {
        updateBounding(obj, i == 0);
      }
    }

    var w = right - left;
    var h = bottom - top;

    if (w < 800) {
      left += w / 2;
      w = 800;
      left -= w / 2;
    }
    if (h < 500) {
      top += h / 2;
      h = 500;
      top -= h / 2;
    }

    var px = (me.canvas.width - 20) / w;
    var py = (me.canvas.height - 20) / h;

    var z = Math.min(px, py);

    if (z > 1 && z < 1.5) z = 1
    if (z > 3) z = 3;

    me.changeZoom(z, {
      x: left + w / 2,
      y: top + h / 2,
    });
  },

  changeZoom: function(z, pos){
    var me = this;
    var c = me.canvas;

    c.setZoom(z);
    console.log('Zoom: ' + z);
    ///////////////////////////////

    $.each(me.objects, function(i, object){
      if(object.objectType == MapItemType.Device) {
        object.updateImageByFilter(z);
      }
    });

    ///////////////////////////////

    if (!pos && me.pan) {
      pos = me.pan;
    }
    if (pos) {
      me.pan = pos;
      var p = {
        x: pos.x * z - c.width / 2,
        y: pos.y * z - c.height / 2,
      };
      c.absolutePan(p);
    }
  },

  convertToRelative: function(p) {
    var me = this;
    var c = {
      x: p.x,
      y: p.y,
    };
    var pos = me.pan;
    var z = me.canvas.getZoom();
    if (pos) {
      c.x += pos.x * z - me.canvas.width / 2;
      c.y += pos.y * z - me.canvas.height / 2;
    }
    c.x /= z;
    c.y /= z;

    return c;
  },

  getPanOffset: function() {
    var me = this;
    var c = me.canvas;

    var offset ={
      x: 0,
      y: 0,
    };
    if (me.pan) {
      var pos = me.pan;
      var z = c.getZoom();
      offset.x = pos.x * z - c.width / 2;
      offset.y = pos.y * z - c.height / 2;
    }

    return offset;
  },

  /////////////////////////////////////////////////////////////

  starLineAnim: function() {
    var me = this;

    me.stopLineAnim();

    me.showLineAnim(true);
    me.animInterval = setInterval(function() {
      me.playLineAnim();
    }, 150);
  },

  stopLineAnim: function() {
    this.showLineAnim(false);
    clearInterval(this.animInterval);
  },

  playLineAnim: function(){
    var me = this;
    $.each(me.objects, function(i, object){
      object.lines && $.each(object.lines, function(i, line){
        line.steps && $.each(line.steps, function(i, step){
          step && step.anim && step.anim.onPlay();
        });
      });
    });

    me.canvas.renderAll();
  },

  showLineAnim: function(visible) {
    var me = this;
    $.each(me.objects, function(i, object){
      object.lines && $.each(object.lines, function(i, line){
        line.steps && $.each(line.steps, function(i, step){
          step && step.anim && step.anim.setVisible(visible);
        });
      });
    });

    me.canvas.renderAll();
  },

  /////////////////////////////////////////////////////////////


  removeSelected: function(){
    var me = this;
    if(!me.selObj) return;

    var object = me.getSelected();

    me.removeMapItem(object);
  },

  removeMapItem: function(object, redraw) {
    var me = this;
    if(object.objectType == MapItemType.Device) {
      $.each(object.lines || [], function(i, line){
        var index = me.connectors.indexOf(line);
        if(index >= 0) me.connectors.splice(index, 1);
      });


    } else if(object.objectType == MapItemType.Shape) {
      var index = me.connectors.indexOf(object);
      if(index >= 0) me.connectors.splice(index, 1);
    }

    object.remove();
    if (redraw) me.canvas.renderAll();
  },

  removeObject: function(object) {
    var me = this;
    var index = me.objects.indexOf(object);
    if(index >= 0) me.objects.splice(index, 1);
  },

  removeConnector: function(connector) {
    var me = this;
    var index = me.connectors.indexOf(connector);
    if(index >= 0) me.connectors.splice(index, 1);
  },

  /////////////////////////////////////////////////////////////
  destroy: function() {
    var me = this;
    var canvas = me.canvas;

    me.stopLineAnim();

    canvas.off('selection:created');

    canvas.off('object:selected');
    canvas.off('selection:cleared');
    canvas.off('object:moving');
    canvas.off('object:scaling');
    canvas.off('mouse:move');
    canvas.off('mouse:down');
    canvas.off('mouse:up');
    canvas.off('text:editing:entered');
    canvas.off('text:editing:exited');

    me.canvas.dispose();
    me.canvas = null;
    me.objects = null;
    me.connectors = null;
    me.listener = null;

    me.destroy = true;
  },

  /////////////////////////////////////////////////////////////

  devicePoints: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 4],
    [2, 4], [2, 3], [2, 2], [2, 1], [2, 0],
    [1, 0]],
  hubPoints: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
    [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17], [0, 18], [0, 19], [0, 20],
    [0, 21], [0, 22], [0, 23], [0, 24], [0, 25], [0, 26], [0, 27], [0, 28], [0, 29], [0, 30],
    [0, 31], [0, 32], [0, 33], [0, 34], [0, 35], [0, 36], [0, 37], [0, 38], [0, 39], [0, 40],
    [0, 41], [0, 42], [0, 43], [0, 44], [0, 45], [0, 46], [0, 47], [0, 48], [0, 49], [0, 50],
    [0, 51], [0, 52], [0, 53], [0, 54], [0, 55], [0, 56], [0, 57], [0, 58], [0, 59], [0, 60],
    [1, 60],

    [2, 60], [2, 59], [2, 58], [2, 57], [2, 56], [2, 55], [2, 54], [2, 53], [2, 52], [2, 51],
    [2, 50], [2, 49], [2, 48], [2, 47], [2, 46], [2, 45], [2, 44], [2, 43], [2, 42], [2, 41],
    [2, 40], [2, 39], [2, 38], [2, 37], [2, 36], [2, 35], [2, 34], [2, 33], [2, 32], [2, 31],
    [2, 30], [2, 29], [2, 28], [2, 27], [2, 26], [2, 25], [2, 24], [2, 23], [2, 22], [2, 21],
    [2, 20], [2, 19], [2, 18], [2, 17], [2, 16], [2, 15], [2, 14], [2, 13], [2, 12], [2, 11],
    [2, 10], [2, 9], [2, 8], [2, 7], [2, 6], [2, 5], [2, 4], [2, 3], [2, 2], [2, 1], [2, 0],
    [1, 0]],
  getConnectionPoint: function(obj, point, group, hub) {
    var me = this;
    var props = hub ? me.hubPoints : me.devicePoints;

    if(group) {
      var objects = group.getObjects();
      if(objects.indexOf(obj) < 0) group = false;
    }

    if (point == -1) {
      pos = {
        x: obj.left + obj.width * obj.scaleX / 2 + (group ? (group.left + group.width / 2): 0),
        y: obj.top + obj.height * obj.scaleY / 2 + (group ? (group.top + group.height / 2): 0)
      };
      return pos;
    } else if (props.length <= point) {
      point = props.length - 1;
    }

    if(hub) {
      var r = obj.getBoundingRect();

      if (obj.id == '3214984')
        obj.left += 0;

      var dx = obj.width * obj.scaleX * props[point][0] / 2.0;
      var dy = obj.height * obj.scaleY * props[point][1] / 60.0;
      var dl = Math.sqrt(dx * dx + dy * dy);
      var alpha = Math.atan2(dy, dx);

      var pos = {
        x: obj.left + Math.cos(obj.getAngle() * Math.PI / 180 + alpha) * dl + (group ? (group.left + group.width / 2): 0),
        y: obj.top + Math.sin(obj.getAngle() * Math.PI / 180 + alpha) * dl + (group ? (group.top + group.height / 2): 0)
      };

      return pos;
    }

    var pos = {
      x: obj.left + obj.width * obj.scaleX * props[point][0] / 2 + (group ? (group.left + group.width / 2): 0),
      y: obj.top + obj.height * obj.scaleY * props[point][1] / 4 + (group ? (group.top + group.height / 2): 0)
    };

    return pos;
  },

  calcDistance: function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  calcAngle: function (x1, y1, x2, y2) {
    var a = this.calcAngleRad(x1, y1, x2, y2) * (180 / Math.PI);
    return (a < 0) ? (a += 360) : a;
  },

  calcAngleRad: function (x1, y1, x2, y2) {
    return Math.atan2( (y2 - y1) , (x2 - x1) );
  },
};
