// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"utils/vmath.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Vector math functions
 */
var VMath = {};

VMath.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

VMath.magnitude = function (a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};

VMath.normalize = function (a) {
  var mag = VMath.magnitude(a);

  if (mag === 0) {
    return {
      x: 0,
      y: 0
    };
  } else {
    return {
      x: a.x / mag,
      y: a.y / mag
    };
  }
};

VMath.add = function (a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
};

VMath.sub = function (a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
};

VMath.mult = function (a, b) {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  };
};

VMath.distance = function (a, b) {
  var x = a.x - b.x;
  var y = a.y - b.y;
  return {
    x: x,
    y: y
  };
};

VMath.angle = function (a, b) {
  var ax = a.x - b.x;
  var ay = a.y - b.y;
  return Math.atan2(ay, ax);
};

VMath.angleBetween = function (a, b) {
  return Math.acos(VMath.dot(a, b) / (VMath.magnitude(a) * VMath.magnitude(b)));
};

VMath.rotate = function (a, angle) {
  var ca = Math.cos(angle);
  var sa = Math.sin(angle);
  var rx = a.x * ca - a.y * sa;
  var ry = a.x * sa + a.y * ca;
  return {
    x: rx * -1,
    y: ry * -1
  };
};

VMath.invert = function (a) {
  return {
    x: a.x * -1,
    y: a.y * -1
  };
};
/*
 * VMath cross product function has been simplified by
 * setting x and y to zero because vectors a and b
 * lie in the canvas plane
 */


VMath.cross = function (a, b) {
  return {
    x: 0,
    y: 0,
    z: a.x * b.y - b.x * a.y
  };
};

var _default = VMath;
exports.default = _default;
},{}],"utils/canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Canvas =
/*#__PURE__*/
function () {
  function Canvas(el) {
    _classCallCheck(this, Canvas);

    this.el = el;
    this.ctx = el.getContext('2d');
    this.aspectRatio = 1;
    this.width = null;
    this.height = null;
    this.mouseOver = false;
    this.t = 0;
    this.tDelta = 0.1;
    this.mouseCoords = {
      x: 0,
      y: 0
    };
  }

  _createClass(Canvas, [{
    key: "setCanvasDimensions",
    value: function setCanvasDimensions() {
      var w = window.innerWidth * 0.66;
      this.el.width = w;
      this.el.height = w * this.aspectRatio;
    }
  }, {
    key: "getMousePos",
    value: function getMousePos(e) {
      if (e.targetTouches && e.targetTouches[0]) {
        e = e.targetTouches[0];
      }

      var rect = this.el.getBoundingClientRect();
      this.mouseCoords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      // Store the current transformation matrix
      this.ctx.save(); // Use the identity matrix while clearing the canvas

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.width, this.height); // Restore the transform

      this.ctx.restore();
    }
  }, {
    key: "_mouseOver",
    value: function _mouseOver(bln) {
      this.mouseOver = bln;
    }
  }, {
    key: "draw",
    value: function draw(cb) {
      console.log(cb); // if(!cb) return

      this.clearCanvas();
      cb();
      requestAnimationFrame(this.draw.bind(this, cb));
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      this.setCanvasDimensions();
      window.addEventListener('resize', this.setCanvasDimensions.bind(this));
      this.el.addEventListener('mousemove', function (e) {
        return _this.getMousePos.apply(_this, [e]);
      });
      this.el.addEventListener('mouseenter', function () {
        return _this._mouseOver.bind(_this, true);
      });
      this.el.addEventListener('mouseleave', function () {
        return _this._mouseOver.bind(_this, false);
      }); // smoothhack

      this.ctx.translate(0.5, 0.5);
    }
  }]);

  return Canvas;
}();

exports.default = Canvas;
},{}],"test.js":[function(require,module,exports) {
"use strict";

require("./index.scss");

var _vmath = _interopRequireDefault(require("./utils/vmath"));

var _canvas = _interopRequireDefault(require("./utils/canvas"));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { TweenLite } from './utils/Tweenlite.min'
var c = document.querySelector('#canvas');
var canvas = new _canvas.default(c);
canvas.init();

var draw = function draw() {
  t += tDelta;
  clearCanvas();
  canvas.ctx.save();
  canvas.ctx.translate(_this.pos.x, _this.pos.y);
  canvas.ctx.beginPath();
  canvas.ctx.fillStyle = "rgba(114, 127, 187, ".concat(_this.opacity, ")");
  canvas.ctx.arc(0, 0, _this.radius, 0, Math.PI * 2);
  canvas.ctx.fill();
  canvas.ctx.restore();
  window.requestAnimationFrame(draw);
};

canvas.draw(draw);
requestAnimationFrame((void 0).draw.bind(void 0));
},{"./index.scss":"index.scss","./utils/vmath":"utils/vmath.js","./utils/canvas":"utils/canvas.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55528" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","test.js"], null)
//# sourceMappingURL=/test.e98b79dd.js.map