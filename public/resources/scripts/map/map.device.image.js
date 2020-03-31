fabric.DeviceImage = fabric.util.createClass(fabric.Image, {
  onMoving: function(e, diff, group) {
    var me = this;

    me.updateStatusImage(group);

    if(me.deviceObj) {
      me.deviceObj.onImageObjMoving(e, diff, group);
    }
  },

  onScaling: function(e, diff) {
    var me = this;
    me.updateStatusImage();

    if(me.deviceObj) {
      me.deviceObj.onImageObjScaling(e, diff);
    };
  },

  onMoved: function(group) {
    var me = this;
    if(me.deviceObj) {
      return me.deviceObj.onImageObjMoved(group);
    };

    return true;
  },

  onSelectionCleared: function(){

  },


  onSelected: function() {
    var me = this;
    me.deviceObj &&
    me.deviceObj.onImageObjectSelected();
  },

  updateStatusImage: function(group){
    var me = this;
    if(!me.statusImageObj) return;

    me.statusImageObj.set({
      width: 24,
      height: 24,
      left: Math.ceil(me.left + me.width * me.scaleX + me.statusImageLeft * me.width * me.scaleX/50 + (group ? (group.left + group.width / 2): 0)),
      top: Math.ceil(me.top + me.statusImageTop * me.height * me.scaleY/50 + (group ? (group.top + group.height / 2): 0)),
    });
    me.statusImageObj.setCoords();
  },

  remove: function(){
    var me = this;

    if(me.statusImageObj) {
      me.statusImageObj.remove();
      me.canvas.remove(me.statusImageObj);
    }

    me.canvas.remove(me);

    this.callSuper('remove');
  },

  ////////////

  //Tweak
  updateImageByFilter: function(callback) {
    var filters = this.filters;
    var imgElement = this._originalElement;

    if (!imgElement) {
      return;
    }

    var imgEl = imgElement,
      canvasEl = fabric.util.createCanvasElement(),
      replacement = fabric.util.createImage(),
      _this = this;

    canvasEl.width = imgEl.width;
    canvasEl.height = imgEl.height;
    canvasEl.getContext('2d').drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

    if (filters.length === 0) {
      this._element = imgElement;
      callback && callback();
      return canvasEl;
    }
    filters.forEach(function(filter) {
      filter && filter.applyTo(canvasEl, filter.scaleX || _this.scaleX, filter.scaleY || _this.scaleY);
      if (!forResizing && filter && filter.type === 'Resize') {
        _this.width *= filter.scaleX;
        _this.height *= filter.scaleY;
      }
    });

    /** @ignore */
    replacement.width = canvasEl.width;
    replacement.height = canvasEl.height;

    if (fabric.isLikelyNode) {
      replacement.src = canvasEl.toBuffer(undefined, fabric.Image.pngCompression);
      // onload doesn't fire in some node versions, so we invoke callback manually
      _this._element = replacement;
      !forResizing && (_this._filteredEl = replacement);
      callback && callback();
    }
    else {
      replacement.onload = function() {
        _this._element = replacement;
        !forResizing && (_this._filteredEl = replacement);
        callback && callback();
        replacement.onload = canvasEl = imgEl = null;
      };
      replacement.src = canvasEl.toDataURL('image/png');
    }
  }
});