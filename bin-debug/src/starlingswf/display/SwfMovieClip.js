/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    var SwfMovieClip = (function (_super) {
        __extends(SwfMovieClip, _super);
        function SwfMovieClip(frames, labels, displayObjects, ownerSwf, frameEvents) {
            if (frameEvents === void 0) { frameEvents = null; }
            _super.call(this);
            this._isPlay = false;
            this.loop = true;
            this._completeFunction = null; //播放完毕的回调
            this._hasCompleteListener = false; //是否监听过播放完毕的事件
            this._frames = frames;
            this._labels = labels;
            this._displayObjects = displayObjects;
            this._frameEvents = frameEvents;
            this._startFrame = 0;
            this._endFrame = this._frames.length - 1;
            this._ownerSwf = ownerSwf;
            this.setCurrentFrame(0);
            this.play();
        }
        var __egretProto__ = SwfMovieClip.prototype;
        __egretProto__.update = function () {
            //            trace.log("加载mc" );
            if (!this._isPlay)
                return;
            if (this._currentFrame > this._endFrame) {
                var isReturn = false;
                if (!this.loop || this._startFrame == this._endFrame) {
                    if (this._ownerSwf)
                        this.stop(false);
                    isReturn = true;
                }
                if (this._hasCompleteListener)
                    this.dispatchEventWith(egret.Event.COMPLETE);
                if (isReturn)
                    return;
                this.setCurrentFrame(this._startFrame);
            }
            else {
                this.setCurrentFrame(this._currentFrame);
                this._currentFrame += 1;
            }
        };
        __egretProto__.setCurrentFrame = function (frame) {
            //dirty hack this.removeChildren();
            this._children.length = 0;
            this._currentFrame = frame;
            this.__frameInfos = this._frames[this._currentFrame];
            var data;
            var display;
            var textfield;
            var useIndex;
            var length = this.__frameInfos.length;
            for (var i = 0; i < length; i++) {
                data = this.__frameInfos[i];
                useIndex = data[10];
                display = this._displayObjects[data[0]][useIndex];
                display._DO_Props_._skewX = data[6];
                display._DO_Props_._skewY = data[7];
                display._DO_Props_._alpha = data[8];
                display.name = data[9];
                //                if(data[1] == Swf.dataKey_Particle){
                //                    display["setPostion"](data[2],data[3]);
                //                }else{
                display._DO_Props_._x = data[2];
                display._DO_Props_._y = data[3];
                switch (data[1]) {
                    case starlingswf.Swf.dataKey_Scale9:
                        display.width = data[11];
                        display.height = data[12];
                        starlingswf.SwfBlendMode.setBlendMode(display, data[13]);
                        break;
                    case starlingswf.Swf.dataKey_ShapeImg:
                        display.width = data[11];
                        display.height = data[12];
                        starlingswf.SwfBlendMode.setBlendMode(display, data[13]);
                        break;
                    case starlingswf.Swf.dataKey_TextField:
                        textfield = display;
                        textfield.width = data[11];
                        textfield.height = data[12];
                        textfield.fontFamily = data[13];
                        textfield.textColor = data[14];
                        textfield.size = data[15];
                        textfield.textAlign = data[16];
                        //                        textfield["italic"] = data[17];
                        //                        textfield["bold"] = data[18];
                        if (data[19] && data[19] != "\r" && data[19] != "") {
                            textfield.text = data[19];
                        }
                        starlingswf.SwfBlendMode.setBlendMode(textfield, data[20]);
                        break;
                    default:
                        display._DO_Props_._scaleX = data[4];
                        display._DO_Props_._scaleY = data[5];
                        starlingswf.SwfBlendMode.setBlendMode(display, data[11]);
                        break;
                }
                this._children.push(display);
                display._DO_Props_._parent = this;
            }
            if (this._frameEvents != null && this._frameEvents[this._currentFrame] != null) {
                this.dispatchEventWith(this._frameEvents[this._currentFrame]);
            }
        };
        __egretProto__.getCurrentFrame = function () {
            return this._currentFrame;
        };
        /**
         * 播放
         * */
        __egretProto__.play = function (yfqian_isPlay) {
            if (yfqian_isPlay === void 0) { yfqian_isPlay = true; }
            this._isPlay = true;
            this._ownerSwf.swfUpdateManager.addSwfAnimation(this);
            var k;
            var arr;
            var l;
            for (k in this._displayObjects) {
                if (k.indexOf(starlingswf.Swf.dataKey_MovieClip) == 0) {
                    arr = this._displayObjects[k];
                    l = arr.length;
                    for (var i = 0; i < l; i++) {
                        arr[i].play();
                    }
                }
            }
        };
        /**
         * 停止
         * @param	stopChild	是否停止子动画
         * */
        __egretProto__.stop = function (stopChild) {
            if (stopChild === void 0) { stopChild = true; }
            this._isPlay = false;
            this._ownerSwf.swfUpdateManager.removeSwfAnimation(this);
            if (!stopChild)
                return;
            var k;
            var arr;
            var l;
            for (k in this._displayObjects) {
                if (k.indexOf(starlingswf.Swf.dataKey_MovieClip) == 0) {
                    arr = this._displayObjects[k];
                    l = arr.length;
                    for (var i = 0; i < l; i++) {
                        arr[i].stop(stopChild);
                    }
                }
            }
        };
        __egretProto__.gotoAndStop = function (frame, stopChild) {
            if (stopChild === void 0) { stopChild = true; }
            this.goTo(frame);
            this.stop(stopChild);
        };
        __egretProto__.gotoAndPlay = function (frame) {
            this.goTo(frame);
            this.play();
        };
        __egretProto__.goTo = function (frame) {
            if (typeof (frame) == "string") {
                var labelData = this.getLabelData(frame);
                this._currentLabel = labelData[0];
                this._currentFrame = this._startFrame = labelData[1];
                this._endFrame = labelData[2];
            }
            else if (typeof (frame) == "number") {
                this._currentFrame = this._startFrame = frame;
                this._endFrame = this._frames.length - 1;
            }
            this.setCurrentFrame(this._currentFrame);
        };
        __egretProto__.getLabelData = function (label) {
            var length = this._labels.length;
            var labelData;
            for (var i = 0; i < length; i++) {
                labelData = this._labels[i];
                if (labelData[0] == label) {
                    return labelData;
                }
            }
            return null;
        };
        /**
         * 是否再播放
         * */
        __egretProto__.isPlay = function () {
            return this._isPlay;
        };
        /**
         * 总共有多少帧
         * */
        __egretProto__.totalFrames = function () {
            return this._frames.length;
        };
        /**
         * 返回当前播放的是哪一个标签
         * */
        __egretProto__.currentLabel = function () {
            return this._currentLabel;
        };
        /**
         * 获取所有标签
         * */
        __egretProto__.labels = function () {
            var length = this._labels.length;
            var returnLabels = [];
            for (var i = 0; i < length; i++) {
                returnLabels.push(this._labels[i][0]);
            }
            return returnLabels;
        };
        /**
         * 是否包含某个标签
         * */
        __egretProto__.hasLabel = function (label) {
            var ls = this.labels();
            return !(ls.indexOf(label) == -1);
        };
        __egretProto__.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            _super.prototype.addEventListener.call(this, type, listener, thisObject, useCapture, priority);
            this._hasCompleteListener = this.hasEventListener(egret.Event.COMPLETE);
        };
        __egretProto__.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            _super.prototype.removeEventListener.call(this, type, listener, thisObject, useCapture);
            this._hasCompleteListener = this.hasEventListener(egret.Event.COMPLETE);
        };
        return SwfMovieClip;
    })(starlingswf.SwfSprite);
    starlingswf.SwfMovieClip = SwfMovieClip;
    SwfMovieClip.prototype.__class__ = "starlingswf.SwfMovieClip";
})(starlingswf || (starlingswf = {}));
//# sourceMappingURL=SwfMovieClip.js.map