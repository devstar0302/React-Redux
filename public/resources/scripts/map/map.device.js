fabric.Device = fabric.util.createClass(fabric.Object, {
  updateLoadingImage: function(group){
    var me = this;
    if(!me.loadingSprite) return;

    me.loadingSprite.set({
      left: Math.ceil(me.imageObj.left + me.imageObj.width * me.imageObj.scaleX / 2 + (group ? (group.left + group.width / 2): 0)),
      top: Math.ceil(me.imageObj.top + me.imageObj.height * me.imageObj.scaleY / 2 + (group ? (group.top +  + group.height / 2): 0)),
    });
    me.loadingSprite.setCoords();
  },

  onImageObjectSelected: function() {
    var me = this;
    me.loadSprite();
    me.imageObj.lastTop = me.imageObj.top;
  },

  onImageObjMoving: function(e, diff, group){
    var me = this;
    if(!group && me.labelObj) {
      //Move Text Together
      me.labelObj.left += diff.x;
      me.labelObj.top += diff.y;
      me.labelObj.setCoords();
    }

    me.updateLoadingImage(group);
    me.updateLines(group, diff, me);
  },

  onImageObjScaling: function(e, diff) {
    var me = this;
    if(me.labelObj) {

      var diffY = diff.height;
      diffY -= me.imageObj.lastTop - me.imageObj.top;

      //Move Text Together
      me.labelObj.top += diffY;
      me.labelObj.fontSize += diff.height / 2;
      if (me.labelObj.fontSize < 5) me.labelObj.fontSize = 5;
      me.labelObj.width += diff.width;
      me.labelObj.left -= diff.width / 2;

      var len = me.labelObj._textLines.length;
      while(me.labelObj._splitTextIntoLines().length > len){
        me.labelObj.width += 30;
        me.labelObj.left -= 15;
      };

      me.labelObj.refineWidth();

      me.labelObj.left = me.imageObj.left +
        (me.imageObj.width * me.imageObj.scaleX - me.labelObj.width * me.labelObj.scaleX) / 2;
      me.labelObj.setCoords();
    }

    me.imageObj.lastTop = me.imageObj.top;

    me.imageObj.updateStatusImage();

    me.updateLoadingImage();
    me.updateLines();

    me.updateImageByFilter(me.canvas.getZoom());
  },

  onImageObjMoved: function(group) {
    var me = this;

    if(group) {
      if(group.getObjects().indexOf(me.labelObj) >= 0) return true;
    }
    me.updateImageByFilter(me.canvas.getZoom());

    return me.notifyMoved(group);
  },

  onLabelObjMoved: function(group) {
    var me = this;
    return me.notifyMoved(group);
  },


  onLabelObjectSelected: function() {
    var me = this;
    me.loadSprite();
  },

  notifyMoved: function(group){
    var me = this;
    var map = me.canvas.map;

    var imgGroup = group ? group.getObjects().indexOf(me.imageObj) >= 0 : false;
    var labelGroup = group ? group.getObjects().indexOf(me.labelObj) >= 0 : false;

    return map.notifyMoved(me.id, {
      left: me.imageObj.left + (imgGroup ? (group.left + group.width / 2): 0),
      top: me.imageObj.top + (imgGroup ? (group.top + group.height / 2): 0),
      width: me.imageObj.width * me.imageObj.scaleX,
      height: me.imageObj.height * me.imageObj.scaleY,
    }, {
      left: me.labelObj.left + (labelGroup ? (group.left + group.width / 2): 0),
      top: me.labelObj.top + (labelGroup ? (group.top + group.height / 2): 0),
      width: me.labelObj.width * me.labelObj.scaleX,
      height: me.labelObj.height * me.labelObj.scaleY,
      size: me.labelObj.fontSize,
      align: me.labelObj.textAlign,
    }, '', me.data.fatherid);
  },

  onLabelChanged: function(){
    var me = this;
    var map = me.canvas.map;
    map.notifyTextChanged(me.id, me.labelObj.text, true);

    me.fitText();
  },

  onEditStateChange: function(editable){
    var me = this;
    if(me.imageObj.statusImageObj && !me.canvas.map.zooming)
      me.imageObj.statusImageObj.visible = !editable;
    me.imageObj.selectable = editable;
    me.labelObj.selectable = editable;
  },

  getConnectionPoint: function(point, group) {
    var me = this;
    return me.canvas.map.getConnectionPoint(this.imageObj, point, group);
  },

  dropObj: function() {
    var me = this;
    return me.imageObj;
  },

  changeFontSize: function(increase) {
    var me = this;
    var label = me.labelObj;
    if (increase) {
      if (label.fontSize < 72) label.fontSize += 1;
    } else {
      if (label.fontSize > 10) label.fontSize -= 1;
    }
    me.notifyMoved();
    me.canvas.renderAll();
  },

  changeAlign: function(align) {
    var me = this;
    var label = me.labelObj;
    label.setTextAlign(align);
    me.notifyMoved();
  },

  fitText: function(){
    var me = this;
    var label = me.labelObj;
    var image = me.imageObj;

    var ctx = label.ctx;
    ctx.save();
    ctx.font = label.fontSize + "px " + label.fontFamily;
    var width = ctx.measureText(label.text).width;

    label.setWidth(Math.ceil(width) + 1);
    label.refineWidth();

    var maxwidth = 0;
    $.each(label._splitTextIntoLines(), function(i, text){
      width = ctx.measureText(text.replace(/\s+$/, '')).width;
      if (width > maxwidth) maxwidth = width;
    });
    ctx.restore();
    label.left = image.left + image.width / 2 - maxwidth / 2;
    label.setCoords();

    me.canvas.renderAll();

    me.notifyMoved();
  },

  showLoading: function(show) {
    var me = this;
    if (!me.loadingSprite) return;
    if (show) {
      if(!me.loadingSprite.visible)
        me.loadingSprite.play();
      me.loadingSprite.visible = true;
    } else {
      me.loadingSprite.stop();
      me.loadingSprite.visible = false;
    }
  },

  loadSprite: function(){
    var me = this;
    if (me.isLoadingSprite || me.loadingSprite) return;
    me.isLoadingSprite = true;

    //Loading Image
    // fabric.Sprite.fromURL('/images/loading-sprite.gif', function(sprite){
    //   me.loadingSprite = sprite;
    //   sprite.set({
    //     visible: false,
    //     selectable: false,
    //     originX: 'center',
    //     originY: 'center',
    //   });
    //   me.updateLoadingImage();
    //   me.canvas.add(sprite);
    // });
  },

  addUploading: function(){
    var me = this;
    me.loading++;
    me.showLoading(true);
  },

  removeUploading: function(){
    var me = this;
    me.loading--;
    if(me.loading < 0) me.loading++;
    if(me.loading == 0) me.showLoading(false);
  },

  highlight: function(show) {
    var me = this;
    me.canvas.map.showHighlightRect(me, me.labelObj, show);
  },

  getBoundingRect: function() {
    var me = this;
    return me.imageObj.getBoundingRect();
  },

  getObjectRect: function() {
    var me = this;
    var imgRect = me.imageObj.getBoundingRect();
    var labelRect = me.labelObj.getBoundingRect();

    var rect = {
      left: Math.min(imgRect.left, labelRect.left),
      top: Math.min(imgRect.top, labelRect.top),
      right: Math.max(imgRect.left + imgRect.width, labelRect.left + labelRect.width),
      bottom: Math.max(imgRect.top + imgRect.height, labelRect.top + labelRect.height),
    };

    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;

    return rect;
  },

  changeStatusImage: function(src){
    var me = this;
    var statusImageObj = me.imageObj.statusImageObj;
    statusImageObj.setSrc(src, function(){

    }, {crossOrigin: 'anonymous'});
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
      width: config.width || 0,
      height:config.height || 0,

      data: config.data,
      tooltip: config.tooltip,
    });

    var imageObj = me.imageObj;
    var labelObj = me.labelObj;
    var statusImageObj = imageObj.statusImageObj;

    imageObj.setSrc(config.imageUrl, function(){
      imageObj.set({
        statusImageLeft: config.statusImageLeft,
        statusImageTop: config.statusImageTop,

        left: config.imageLeft,
        top: config.imageTop,
        width: config.imageWidth,
        height:config.imageHeight,

        scaleX: 1,
        scaleY: 1,
      }, {crossOrigin: 'anonymous'});
      if(config.type == "genericdevice"){
        imageObj.setFill('red');
      }
      imageObj.setCoords();


      labelObj.set({
        text: config.text || '',
        left: config.textLeft,
        top: config.textTop,
        width: config.textWidth,
        fontSize: config.textSize || 13,
        textAlign: config.textAlign || 'center',
      });
      labelObj.setCoords();

      //refine position
      var diff = {
        x: imageObj.left,
        y: imageObj.top,
      };
      me.canvas.map.refinePosition(imageObj);
      diff.x = imageObj.left - diff.x;
      diff.y = imageObj.top - diff.y;
      me.onImageObjMoving(null, diff, false);
      labelObj.refineWidth();
      me.updateLines();

      statusImageObj.setSrc(config.statusImageUrl, function(){
        imageObj.updateStatusImage();
        me.canvas.renderAll();
      }, {crossOrigin: 'anonymous'});
    }, {crossOrigin: 'anonymous'});
  },

  updateImageByFilter: function(z) {
    var me = this;
    var imageObj = me.imageObj;
    if (!imageObj) return;
    if (!imageObj.filters || !imageObj.filters.length) return;
    var filter = imageObj.filters[0];

    filter.scaleX = imageObj.width * imageObj.scaleX / imageObj.orgWidth * z ;
    filter.scaleY = imageObj.height * imageObj.scaleY / imageObj.orgHeight * z;

    imageObj.applyFilters(null, imageObj.filters, imageObj._originalElement, true);
  },

  remove: function(){
    var me = this;
    var map = me.canvas.map;

    if(me.imageObj) {
      me.imageObj.remove();
    }

    if(me.labelObj) {
      me.labelObj.remove();
      me.canvas.remove(me.labelObj);
    }

    if (me.loadingSprite) {
      me.loadingSprite.stop();
      me.loadingSprite.remove && me.loadingSprite.remove();
      me.canvas.remove(me.loadingSprite);
    }

    me.removeLines();

    map.removeObject(me);

    this.callSuper('remove');
  },

  removeLines: function() {
    var me = this;
    var map = me.canvas.map;
    $.each(me.lines.splice(0), function(i, line){
      map.removeConnector(line);
      line.remove();
    });
  },
});

fabric.Device.create = function(options, callback){
  var defaults = {
    imageUrl: '/images/linux.png',
    text: '',
    canvas: null,
  };

  var config = $.extend({}, defaults, options);

  //Image
  var imageObj = new fabric.DeviceImage();
  imageObj.set({
    objectType: MapItemType.Device,
    objectSubType: MapItemType.DeviceImage,
    left: config.imageLeft,
    top: config.imageTop,
    width: config.imageWidth,
    height:config.imageHeight,

    statusImageLeft: config.statusImageLeft,
    statusImageTop: config.statusImageTop,

    hasRotatingPoint: false,
    lockScalingFlip: true,

    canvas: config.canvas,
  });
  imageObj.setCoords();
  imageObj.setSrc(config.imageUrl, function(){

    imageObj.orgWidth = imageObj.width;
    imageObj.orgHeight = imageObj.height;

    var filter = new fabric.Image.filters.Resize({
      resizeType: 'sliceHack',
      scaleX: config.imageWidth / imageObj.width,
      scaleY: config.imageHeight / imageObj.height,
    })
    imageObj.filters.push(filter)
    imageObj.applyFilters();

    imageObj.set({
      left: config.imageLeft,
      top: config.imageTop,
      width: config.imageWidth,
      height:config.imageHeight,
    });

    //refine position
    var diff = {
      x: imageObj.left,
      y: imageObj.top,
    };
    config.canvas.map.refinePosition(imageObj);
    diff.x = imageObj.left - diff.x;
    diff.y = imageObj.top - diff.y;
    deviceObj.onImageObjMoving(null, diff, false);

    imageObj.updateStatusImage();

    labelObj.refineWidth();


    if(config.type == "genericdevice"){
      imageObj.setFill('red');
    }

    config.canvas.add(imageObj);
    if (imageObj.statusImageObj) {
      config.canvas.remove(imageObj.statusImageObj);
      config.canvas.add(imageObj.statusImageObj);
    }

    callback && callback(deviceObj);
  }, {crossOrigin: 'anonymous'});

  //Label
  var labelObj = new fabric.DeviceLabel.create({
    canvas: config.canvas,
    text: config.text || '',
    left: config.textLeft,
    top: config.textTop,
    width: config.textWidth,
    fontSize: config.textSize || 13,
    textAlign: config.textAlign || 'center',
  });
  labelObj.setCoords();

  //Status Icon
  var statusImageObj = new fabric.Image();
  statusImageObj.set({
    selectable: false,
    hasControls: false,
    hasBorders: false,
  });

  statusImageObj.setSrc(config.statusImageUrl, function(){
    imageObj.statusImageObj = statusImageObj;
    deviceObj.onEditStateChange(config.canvas.map.editable);
    imageObj.updateStatusImage();

    config.canvas.add(statusImageObj);
  }, {crossOrigin: 'anonymous'});

  //Now Create
  var deviceObj = new fabric.Device({
    id: config.id,

    canvas: config.canvas,
    objectType: MapItemType.Device,
    grouptype: 'device',
    data: config.data,

    hasRotatingPoint: false,

    imageObj: imageObj,
    labelObj: labelObj,

    loading: 0,

    width: 0,
    height: 0,

    lines: [],

    loadingSprite: null,
    isLoadingSprite: false,

    tooltip: config.tooltip,
  });

  imageObj.deviceObj = deviceObj;
  labelObj.deviceObj = deviceObj;

  return deviceObj;
};
