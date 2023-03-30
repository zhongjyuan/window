window.ZHONGJYUANAPP = {
    EVENTS: {
      DATA_CHANGED: 'dataChanged',
      OPEN: 'open',
      CLOSE: 'close',
      DESKTOP_MOUSE_MOVE: 'desktopMouseMove',
      DESKTOP_MOUSE_DOWN: 'desktopMouseDown',
      DESKTOP_MOUSE_UP: 'desktopMouseUp',
      DESKTOP_CLICK: 'desktopClick',
      RESIZE: 'resize',
    },
    METHODS: {
      GET_ID: 'getID',
      GET_VERSION: 'getVersion',
      HISTORY_BACK: 'historyBack',
      HISTORY_BACK_AVAILABLE: 'historyBackAvailable',
      HISTORY_FORWARD: 'historyForward',
      HISTORY_FORWARD_AVAILABLE: 'historyForwardAvailable',
      REFRESH: 'refresh',
      SET_WIN_DATA: 'setWinData',
      GET_WIN_DATA: 'getWinData',
      SET_WALLPAPER: 'setWallpaper',
      SET_THEME_COLOR: 'setThemeColor',
      GET_CONFIGS: 'getConfigs',
      GET_RUNTIME: 'getRuntime',
      OPEN: 'open',
      CLOSE: 'close',
      MINIMIZE: 'minimize',
      MAXIMIZE: 'maximize',
      HIDE: 'hide',
      SHOW: 'show',
      RESTORE: 'restore',
      MSG: 'msg',
      SIMPLE_MSG: 'simpleMsg',
      SET_APP_BADGE: 'setAppBadge',
      GET_APP_VERSION: 'getAppVersion',
      UNINSTALL: 'uninstall',
      IMPORT: 'import',
      EXPORT: 'export',
      EVAL: 'eval',
      SETUP: 'setup',
    },
    _idCounter: 0,
    _cbs: {},
    _cbReady: null,
    _created: false,
    _cbEvent: function () {
    },
    id: "",
    secrete: '',
    data: null,
    oldHref: "",
    /**
     * @param event string 事件名
     * @param data 数据
     * @param target 发送目标，可以是单个id，id数组，或者true（发送给所有窗口）
     * */
    emit: function (event, data, target) {
      var session = this._idCounter++;
      parent.postMessage({
        from: [ZHONGJYUANAPP.id, ZHONGJYUANAPP.secrete],
        type: "zhopngjyuan-emit",
        session: session,
        emit: {
          event: event,
          data: data,
          target: target
        }
      }, "*")
    },
    eval: function (method, data, cb) {
      var session = this._idCounter++;
      this._cbs[session] = cb;
      parent.postMessage({
        from: [ZHONGJYUANAPP.id, ZHONGJYUANAPP.secrete],
        type: "zhopngjyuan-eval",
        session: session,
        eval: {
          method: method,
          data: data,
        }
      }, "*")
    },
    open: function (url) {
      this.eval('open', [{
        url: url,
      }]);
    },
    onEvent: function (cb) {
      this._cbEvent = cb;
    },
    onReady: function (cb) {
      if (this._cbReady === false) return; //只允许ready一次
      if (!cb) {
        cb = function () {
        }
      }
      this._cbReady = cb;
    },
    hashBugForIeFix: function () {
      document.body.focus(); //hash的bug，兼容IE
    },
    getWinObject: function (id) {
      //获取同域的子窗体句柄
      try {
        var win = parent.ZHONGJYUANA.vue.wins[id];
        var idIframe = win.idIframe;
        var iframe = parent.document.getElementById(idIframe);
        return iframe.contentWindow;
      } catch (e) {
        return null;
      }
    },
  };
  
  var OnMessage = function (message) {
    var msg = message.data;
    switch (msg.type) {
      case "zhongjyuan-ping":
        if (ZHONGJYUANAPP.id) {
          parent.postMessage({
            from: [ZHONGJYUANAPP.id, ZHONGJYUANAPP.secrete],
            type: "zhopngjyuan-pong",
          }, "*");
          if (ZHONGJYUANAPP._cbReady) {
            var relCbReady = ZHONGJYUANAPP._cbReady(); //执行ready的回调
            ZHONGJYUANAPP._cbReady = false;//清空ready
            if (relCbReady !== false)
              ZHONGJYUANAPP.emit('ready', null, true); //发送ready事件
          }
          if (!ZHONGJYUANAPP._created) {
            ZHONGJYUANAPP.eval('getWinData', {}, function (data) {
              if (data.title === '') {
                ZHONGJYUANAPP.eval('setWinData', { title: document.title });
              }
            });
            //F5屏蔽大法
            var check = function (e) {
              e = e || window.event;
              if ((e.which || e.keyCode) === 116) {
                if (e.preventDefault) {
                  e.preventDefault();
                  // window.location.reload();
                  ZHONGJYUANAPP.eval('refresh', window.ZHONGJYUANAPP.id);
                } else {
                  event.keyCode = 0;
                  e.returnValue = false;
                  // window.location.reload();
                  ZHONGJYUANAPP.eval('refresh', window.ZHONGJYUANAPP.id);
                }
              }
            };
  
            if (document.addEventListener) {
              document.addEventListener("keydown", check, false);
            } else {
              document.attachEvent("onkeydown", check);
            }
  
            ZHONGJYUANAPP._created = true;
          }
        } else {
          ZHONGJYUANAPP.id = msg.id;
          ZHONGJYUANAPP.secrete = msg.secrete;
          ZHONGJYUANAPP.data = msg.data;
          //实时更新url
          var url = location.href;
          if (ZHONGJYUANAPP.oldHref !== url) {
            ZHONGJYUANAPP.oldHref = url;
            ZHONGJYUANAPP.eval('urlRel', url);
          }
        }
        break;
      case "zhopngjyuan-eval":
        var session = msg.session;
        var rel = msg.result;
        if (ZHONGJYUANAPP._cbs[session]) {
          ZHONGJYUANAPP._cbs[session](rel);
        }
        break;
      case "zhongjyuan-event":
        ZHONGJYUANAPP._cbEvent(msg);
        break;
    }
  };
  
  
  if (window.attachEvent) {
    window.attachEvent('message', OnMessage)
  } else {
    window.addEventListener('message', OnMessage)
  }