/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /** 动画更新管理器 */
    var SwfUpdateManager = (function () {
        function SwfUpdateManager() {
        }
        var __egretProto__ = SwfUpdateManager.prototype;
        SwfUpdateManager.createSwfUpdateManager = function (fps) {
            var updateManager = new SwfUpdateManager();
            updateManager._animations = [];
            updateManager._addQueue = [];
            updateManager._removeQueue = [];
            updateManager._currentTime = 0;
            updateManager.setFps(fps);
            egret.Ticker.getInstance().register(updateManager.update, updateManager);
            return updateManager;
        };
        __egretProto__.setFps = function (fps) {
            this._fps = fps;
            this._fpsTime = 1000 / fps;
        };
        __egretProto__.addSwfAnimation = function (animation) {
            this._addQueue.push(animation);
        };
        __egretProto__.removeSwfAnimation = function (animation) {
            this._removeQueue.push(animation);
        };
        __egretProto__.updateAdd = function () {
            var len = this._addQueue.length;
            var index;
            var animation;
            for (var i = 0; i < len; i++) {
                animation = this._addQueue.pop();
                index = this._animations.indexOf(animation);
                if (index == -1) {
                    this._animations.push(animation);
                }
            }
        };
        __egretProto__.updateRemove = function () {
            var len = this._removeQueue.length;
            var index;
            var animation;
            for (var i = 0; i < len; i++) {
                animation = this._removeQueue.pop();
                index = this._animations.indexOf(animation);
                if (index != -1) {
                    this._animations.splice(index, 1);
                }
            }
        };
        __egretProto__.update = function (time) {
            this._currentTime += time;
            if (this._currentTime < this._fpsTime) {
                return;
            }
            this._currentTime -= this._fpsTime;
            if (this._currentTime > this._fpsTime) {
                this._currentTime = 0;
            }
            this.updateRemove();
            this.updateAdd();
            var len = this._animations.length;
            for (var i = 0; i < len; i++) {
                this._animations[i].update();
            }
        };
        return SwfUpdateManager;
    })();
    starlingswf.SwfUpdateManager = SwfUpdateManager;
    SwfUpdateManager.prototype.__class__ = "starlingswf.SwfUpdateManager";
})(starlingswf || (starlingswf = {}));
//# sourceMappingURL=SwfUpdateManager.js.map