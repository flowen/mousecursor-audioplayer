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
const VMath = {};

VMath.dot = (a, b) => a.x * b.x + a.y * b.y;

VMath.magnitude = a => Math.sqrt(a.x * a.x + a.y * a.y);

VMath.normalize = a => {
  const mag = VMath.magnitude(a);

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

VMath.add = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
};

VMath.sub = (a, b) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
};

VMath.mult = (a, b) => {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  };
};

VMath.distance = (a, b) => {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return {
    x,
    y
  };
};

VMath.angle = (a, b) => {
  const ax = a.x - b.x;
  const ay = a.y - b.y;
  return Math.atan2(ay, ax);
};

VMath.angleBetween = (a, b) => {
  return Math.acos(VMath.dot(a, b) / (VMath.magnitude(a) * VMath.magnitude(b)));
};

VMath.rotate = (a, angle) => {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const rx = a.x * ca - a.y * sa;
  const ry = a.x * sa + a.y * ca;
  return {
    x: rx * -1,
    y: ry * -1
  };
};

VMath.invert = a => {
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


VMath.cross = (a, b) => {
  return {
    x: 0,
    y: 0,
    z: a.x * b.y - b.x * a.y
  };
};

var _default = VMath;
exports.default = _default;
},{}],"audio/voice.mp3":[function(require,module,exports) {
module.exports = "/voice.641a1749.mp3";
},{}],"audio/voice.ogg":[function(require,module,exports) {
module.exports = "/voice.3dfedc3c.ogg";
},{}],"utils/audioplayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Player {
  constructor() {
    if (!window.AudioContext) {
      if (window.webkitAudioContext) {
        window.AudioContext = window.webkitAudioContext;
      } else {
        throw new Error('audio context not supported :(');
      }
    }

    this.context = null;
    this.source = null;
    this.totalTime = 0; // after we fetch the buffer we assign totalTime

    this.voiceBuffer = null; // buffer containing the voiceclip

    this.audioMp3Url = require('../audio/voice.mp3');
    this.audioOGGUrl = require('../audio/voice.ogg');
    this.supportsOgg = this.supportsVideoType('ogg');
    this.fetchAudioBuffer = this.fetchAudioBuffer.bind(this);
  } // todo: somehow this always restarts after reaching 100


  get currentProgress() {
    if (this.totalTime === 0) return false;
    const current = this.context.currentTime;
    const percentage = current / this.totalTime * 100;

    if (percentage > 0) {
      return percentage;
    } else {
      return false;
    }
  }

  get state() {
    return this.context !== null ? this.context.state : false;
  }

  supportsVideoType(type) {
    let video;
    const formats = {
      ogg: 'video/ogg; codecs="theora"'
    };

    if (!video) {
      video = document.createElement('video');
    }

    return video.canPlayType(formats[type] || type);
  }

  async fetchAudioBuffer() {
    this.context = new AudioContext();
    this.source = this.context.createBufferSource();
    const url = this.supportsOgg ? this.audioOGGUrl : this.audioMp3Url; // error in safari

    await fetch(url).then(response => response.arrayBuffer()).then(audioData => this.context.decodeAudioData(audioData)).then(audioBuffer => this.voiceBuffer = audioBuffer);
  }

  createBuffer() {
    this.source.onended = () => this.closeBuffer();

    this.source.buffer = this.voiceBuffer;
    this.source.connect(this.context.destination);
    this.source.start();
  }

  closeBuffer() {
    this.context.close();
    this.voiceBuffer = null;
  }

  async play() {
    // only for the first time, we fetch the buffer and start
    if (!this.voiceBuffer) {
      await this.fetchAudioBuffer();
      this.createBuffer();
      this.totalTime = this.source.buffer.duration;
      return;
    }

    if (this.context.state === 'running') {
      this.context.suspend();
    } else if (this.context.state === 'suspended') {
      this.context.resume();
    } else if (this.context.state === 'closed') {
      this.fetchAudioBuffer();
    }
  }

}

exports.default = Player;
},{"../audio/voice.mp3":"audio/voice.mp3","../audio/voice.ogg":"audio/voice.ogg"}],"cursor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vmath = _interopRequireDefault(require("./utils/vmath"));

var _audioplayer = _interopRequireDefault(require("./utils/audioplayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const player = new _audioplayer.default();

class Cursor {
  constructor(w, h) {
    this.opacity = 0;
    this.ease = 0.05;
    this.pos = {
      x: w / 2,
      y: h / 2
    };
    this.vel = {
      x: w / 2,
      y: h / 2
    };
    this.acc = 2;
    this.delta = 0.01;
    this.radius = 50;
    this.force = 2;
    this.distance = false;
  }

  get _getPos() {
    return this.pos;
  }

  get _getOpacity() {
    return this.opacity;
  }

  fadeIn() {
    this.opacity < 1 ? this.opacity += this.delta : this.opacity = 1;
  }

  fadeOut() {
    this.opacity > 0 ? this.opacity -= this.delta * 2 : this.opacity = 0;
  }

  get isMouseOver() {
    // prettier-ignore
    if (Math.abs(this.distance.x) < this.radius && Math.abs(this.distance.y) < this.radius) {
      return true;
    } else {
      return false;
    }
  }

  follow(mouseCoords) {
    this.distance = _vmath.default.distance(mouseCoords, this.pos);
    const offset = 10;

    if (Math.abs(this.distance.x) > offset) {
      this.pos.x += (mouseCoords.x - this.pos.x) * this.ease;
    }

    if (Math.abs(this.distance.y) > offset) {
      this.pos.y += (mouseCoords.y - this.pos.y) * this.ease;
    }
  }

  playVoice() {
    player.play();
  }

  draw(ctx, mouseOver) {
    !mouseOver ? this.fadeOut() : this.fadeIn();
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.beginPath(); // mousecursor

    ctx.fillStyle = `rgba(114, 127, 187, ${this.opacity})`;
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath(); // timer

    if (player.currentProgress) {
      const degrees = player.currentProgress * (360 / 100);
      ctx.strokeStyle = `rgb(255,255,255, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, degrees * Math.PI / 180, true);
      ctx.stroke();
      ctx.closePath();
    } // label


    ctx.font = '22px Work Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

    if (player.state === 'suspended' || !player.state) {
      ctx.fillText('Play', 0, 8);
    } else if (player.state === 'running') {
      ctx.fillText('Pause', 0, 8);
    } else if (player.state === 'closed') {
      ctx.fillText('Play', 0, -8);
      ctx.fillText('again', 0, 18);
      ctx.lineWidth = 2;
    }

    ctx.restore();
  }

}

exports.default = Cursor;
},{"./utils/vmath":"utils/vmath.js","./utils/audioplayer":"utils/audioplayer.js"}],"utils/getMousePos.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMousePos = void 0;

const getMousePos = (e, el) => {
  if (e.targetTouches && e.targetTouches[0]) {
    e = e.targetTouches[0];
  }

  const rect = el.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

exports.getMousePos = getMousePos;
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("./index.scss");

var _cursor = _interopRequireDefault(require("./cursor.js"));

var _getMousePos = require("./utils/getMousePos");

var _vmath = _interopRequireDefault(require("./utils/vmath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import VMath from './utils/vmath'
// show loader (border around circle)
const c = document.querySelector('#canvas');
const ctx = c.getContext('2d');
const windowWidth = window.innerWidth; // const windowHeight = window.innerHeight

const aspectRatio = 1;
const w = windowWidth * 0.66;
const h = w * aspectRatio;

const setCanvasDimensions = () => {
  c.width = w;
  c.height = h;
}; // global variables


let mouseOver = false;
let t = 0; // get coordinates

let mouseCoords = {
  x: 0,
  y: 0
};
const cursor = new _cursor.default(w, h);

const moveCanvas = e => {
  mouseCoords = (0, _getMousePos.getMousePos)(e, c);
};

const enterCanvas = e => {
  mouseOver = true;
};

const leaveCanvas = e => {
  mouseOver = false;
};

const clearCanvas = () => {
  // Store the current transformation matrix
  ctx.save(); // Use the identity matrix while clearing the canvas

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, c.width, c.height); // Restore the transform

  ctx.restore();
};

const playVoice = () => cursor.isMouseOver ? cursor.playVoice() : '';

const init = () => {
  setCanvasDimensions();
  window.addEventListener('resize', setCanvasDimensions);
  c.addEventListener('mouseenter', enterCanvas);
  c.addEventListener('mousemove', moveCanvas);
  c.addEventListener('mouseleave', leaveCanvas);
  c.addEventListener('click', playVoice); // smoothhack

  ctx.translate(0.5, 0.5);
  window.requestAnimationFrame(draw);
};

const draw = () => {
  clearCanvas();

  if (mouseOver) {
    cursor.fadeIn();
  } else if (cursor._getOpacity > 0) {
    cursor.fadeOut();
  }

  cursor.follow(mouseCoords);
  cursor.draw(ctx, mouseOver);
  requestAnimationFrame(draw);
};

init();
},{"./index.scss":"index.scss","./cursor.js":"cursor.js","./utils/getMousePos":"utils/getMousePos.js","./utils/vmath":"utils/vmath.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56795" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/2019-no-framework.e31bb0bc.js.map