(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/app.js":[function(require,module,exports){
(function (global){
"use strict";

var MenuItemComponent = require('./components/menu-item.js').MenuItemComponent;
var Circle = require('./actors/circle.js').Circle;
var Line = require('./actors/line.js').Line;
var App = (function () {
  var App = function App() {
    var container = document.getElementById("canvas");
    var styles = window.getComputedStyle(container);
    this.renderer = new PIXI.autoDetectRenderer(container.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight), 400, { antialias: true });
    container.appendChild(this.renderer.view);

    this.setupEditor();
    this.setupUI();

    this.ui.setSimulation("example.js");
    this.lastSimTime = 0;
    this.simulate(0);

    console.log(new Circle());
  };

  App.prototype.addComponent = function (name, component) {
    Vue.component(name, component.toComponent());
  };

  App.prototype.setupUI = function () {
    Vue.config.debug = true;
    this.addComponent("menu-item", new MenuItemComponent());

    Vue.filter("floatformat", function (value) {
      return value.toFixed(2);
    });

    var renderer = this.renderer;
    var editor = this.editor;
    this.ui = new Vue({
      el: "#app",
      data: {
        menu: [{
          name: "Mathematics",
          children: [{ name: "Eksempel 1", file: "example.js" }, { name: "Eksempel 2", file: "example2.js" }, { name: "Kule", file: "kule.js" }]
        }, {
          name: "Physics",
          children: []
        }],
        isRunning: false,
        time: 0,
        simulation: null
      },
      methods: {
        startStop: function () {
          this.isRunning = !this.isRunning;

          // Round to nearest hundredth:
          this.time = parseFloat(this.time.toFixed(2));
        },

        reset: function () {
          this.time = 0;
        },

        stepBackward: function () {
          this.time -= 0.01;
        },

        stepForward: function () {
          this.time += 0.01;
        },

        setSimulation: function (file) {
          var _this = this;
          $.ajax({
            url: "./src/simulations/" + file,
            type: "GET",
            complete: function (data) {
              editor.getDoc().setValue(data.responseText);
              var code = data.responseText;
              eval(code);
              console.log(simulation);

              _this.simulation = simulation;
              _this.simulation.stage = new PIXI.Stage(16777215);
              _this.simulation.actors = {
                Circle: Circle,
                Line: Line
              };
              _this.simulation.init();
            }
          });
        }
      }
    });
  };

  App.prototype.simulate = function (t) {
    requestAnimFrame(this.simulate.bind(this));
    if (!this.ui.simulation) return;

    var dt = (t - this.lastSimTime) / 1000;
    if (this.ui.isRunning) this.ui.time += dt;

    this.update();
    this.lastSimTime = t;
  };

  App.prototype.update = function () {
    this.ui.simulation.update(this.ui.time);
    this.renderer.render(this.ui.simulation.stage);
    //console.log(this.ui.simulation)
  };

  App.prototype.setupEditor = function () {
    this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true
    });
  };

  return App;
})();

global.app = function () {
  new App();
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./actors/circle.js":"/home/olav/Kilder/SimRealO/src/actors/circle.js","./actors/line.js":"/home/olav/Kilder/SimRealO/src/actors/line.js","./components/menu-item.js":"/home/olav/Kilder/SimRealO/src/components/menu-item.js"}],"/home/olav/Kilder/SimRealO/src/actors/circle.js":[function(require,module,exports){
"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Circle = (function (PIXI) {
  var Circle = function Circle(x, y, radius, line, color) {
    if (line === undefined) line = false;
    if (color === undefined) color = 0;
    PIXI.Graphics.call(this);

    this.beginFill(color, 1);
    this.lineStyle(2, 0, 0.4);
    this.drawCircle(0, 0, radius);
    this.endFill();

    if (line) {
      this.moveTo(0, 0);
      this.lineTo(radius, 0);
    }

    this.x = x;
    this.y = y;
  };

  _extends(Circle, PIXI.Graphics);

  return Circle;
})(PIXI);

exports.Circle = Circle;

},{}],"/home/olav/Kilder/SimRealO/src/actors/line.js":[function(require,module,exports){
"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Line = (function (PIXI) {
  var Line = function Line(x1, y1, x2, y2, color) {
    if (color === undefined) color = 0;
    PIXI.Graphics.call(this);

    this.lineStyle(2, color, 1);
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
  };

  _extends(Line, PIXI.Graphics);

  return Line;
})(PIXI);

exports.Line = Line;

},{}],"/home/olav/Kilder/SimRealO/src/components/component.js":[function(require,module,exports){
"use strict";

var Component = (function () {
  var Component = function Component() {
    this.twoWay = false;
  };

  Component.prototype.toComponent = function () {
    return {
      twoWay: this.twoWay,
      template: this.template(),
      data: this.data,
      computed: this.computed(),
      methods: this.methods()
    };
  };

  Component.prototype.template = function () {
    return "";
  };

  Component.prototype.data = function () {
    return {};
  };

  Component.prototype.computed = function () {
    return {};
  };

  Component.prototype.methods = function () {
    return {};
  };

  return Component;
})();

exports.Component = Component;

},{}],"/home/olav/Kilder/SimRealO/src/components/menu-item.js":[function(require,module,exports){
"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var Component = require("./component.js").Component;
var MenuItemComponent = (function (Component) {
  var MenuItemComponent = function MenuItemComponent() {
    Component.call(this);
    this.twoWay = false;
  };

  _extends(MenuItemComponent, Component);

  MenuItemComponent.prototype.template = function () {
    return "\n            <li class=\"list-group-item\">\n                <span v-on=\"click: open\"><span class=\"label label-info pull-right\" v-if=\"isFolder\">{{isOpen ? '-' : '+'}}</span> {{ model.name }}</span>\n\n                <ul v-show=\"isOpen\" v-if=\"isFolder\">\n                    <div v-repeat=\"model: model.children\" v-component=\"menu-item\"></div>\n                </ul>\n            </li>\n        ";
  };

  MenuItemComponent.prototype.data = function () {
    return {
      isOpen: false
    };
  };

  MenuItemComponent.prototype.computed = function () {
    return {
      isFolder: function () {
        return this.model.children != undefined && this.model.children.length > 0;
      }
    };
  };

  MenuItemComponent.prototype.methods = function () {
    return {
      open: function () {
        if (this.isFolder) {
          this.isOpen = !this.isOpen;
        } else {
          this.$root.setSimulation(this.model.file);
        }
      }
    };
  };

  return MenuItemComponent;
})(Component);

exports.MenuItemComponent = MenuItemComponent;

},{"./component.js":"/home/olav/Kilder/SimRealO/src/components/component.js"}]},{},["./src/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9vbGF2L0tpbGRlci9TaW1SZWFsTy9zcmMvYXBwLmpzIiwiL2hvbWUvb2xhdi9LaWxkZXIvU2ltUmVhbE8vc3JjL2FjdG9ycy9jaXJjbGUuanMiLCIvaG9tZS9vbGF2L0tpbGRlci9TaW1SZWFsTy9zcmMvYWN0b3JzL2xpbmUuanMiLCIvaG9tZS9vbGF2L0tpbGRlci9TaW1SZWFsTy9zcmMvY29tcG9uZW50cy9jb21wb25lbnQuanMiLCIvaG9tZS9vbGF2L0tpbGRlci9TaW1SZWFsTy9zcmMvY29tcG9uZW50cy9tZW51LWl0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7SUNBUSxpQkFBaUIsd0NBQWpCLGlCQUFpQjtJQUNqQixNQUFNLGlDQUFOLE1BQU07SUFDTixJQUFJLCtCQUFKLElBQUk7SUFFTixHQUFHO01BQUgsR0FBRyxHQUNNLFNBRFQsR0FBRyxHQUNTO0FBQ1YsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRCxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUMxSixhQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFDLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxFQUFF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USxpQkFBaUI7R0FBUyxTQUFTOztRQUFuQyxpQkFBaUIsR0FBakIsaUJBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7TWVudUl0ZW1Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9tZW51LWl0ZW0uanMnO1xuaW1wb3J0IHtDaXJjbGV9IGZyb20gJy4vYWN0b3JzL2NpcmNsZS5qcyc7XG5pbXBvcnQge0xpbmV9IGZyb20gJy4vYWN0b3JzL2xpbmUuanMnO1xuXG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICAgICAgICB2YXIgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcihjb250YWluZXIuY2xpZW50V2lkdGggLSBwYXJzZUludChzdHlsZXMucGFkZGluZ0xlZnQpIC0gcGFyc2VJbnQoc3R5bGVzLnBhZGRpbmdSaWdodCksIDQwMCwge2FudGlhbGlhczogdHJ1ZX0pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci52aWV3KTtcblxuICAgICAgICB0aGlzLnNldHVwRWRpdG9yKCk7XG4gICAgICAgIHRoaXMuc2V0dXBVSSgpO1xuXG4gICAgICAgIHRoaXMudWkuc2V0U2ltdWxhdGlvbignZXhhbXBsZS5qcycpO1xuICAgICAgICB0aGlzLmxhc3RTaW1UaW1lID0gMDtcbiAgICAgICAgdGhpcy5zaW11bGF0ZSgwKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhuZXcgQ2lyY2xlKCkpO1xuICAgIH1cblxuICAgIGFkZENvbXBvbmVudChuYW1lLCBjb21wb25lbnQpIHtcbiAgICAgICAgVnVlLmNvbXBvbmVudChuYW1lLCBjb21wb25lbnQudG9Db21wb25lbnQoKSk7XG4gICAgfVxuXG4gICAgc2V0dXBVSSgpIHtcbiAgICAgICAgVnVlLmNvbmZpZy5kZWJ1ZyA9IHRydWU7XG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KCdtZW51LWl0ZW0nLCBuZXcgTWVudUl0ZW1Db21wb25lbnQoKSk7XG5cbiAgICAgICAgVnVlLmZpbHRlcignZmxvYXRmb3JtYXQnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvRml4ZWQoMik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciByZW5kZXJlciA9IHRoaXMucmVuZGVyZXI7XG4gICAgICAgIHZhciBlZGl0b3IgPSB0aGlzLmVkaXRvcjtcbiAgICAgICAgdGhpcy51aSA9IG5ldyBWdWUoe1xuICAgICAgICAgICAgZWw6ICcjYXBwJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBtZW51OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdNYXRoZW1hdGljcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtuYW1lOiAnRWtzZW1wZWwgMScsIGZpbGU6ICdleGFtcGxlLmpzJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge25hbWU6ICdFa3NlbXBlbCAyJywgZmlsZTogJ2V4YW1wbGUyLmpzJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge25hbWU6ICdLdWxlJywgZmlsZTogJ2t1bGUuanMnfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUGh5c2ljcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBpc1J1bm5pbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpbWU6IDAuMCxcbiAgICAgICAgICAgICAgICBzaW11bGF0aW9uOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICAgIHN0YXJ0U3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSdW5uaW5nID0gIXRoaXMuaXNSdW5uaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJvdW5kIHRvIG5lYXJlc3QgaHVuZHJlZHRoOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWUgPSBwYXJzZUZsb2F0KHRoaXMudGltZS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWUgPSAwLjA7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHN0ZXBCYWNrd2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZSAtPSAwLjAxO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzdGVwRm9yd2FyZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZSArPSAwLjAxO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXRTaW11bGF0aW9uOiBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcuL3NyYy9zaW11bGF0aW9ucy8nICsgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmdldERvYygpLnNldFZhbHVlKGRhdGEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29kZSA9IGRhdGEucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWwoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2ltdWxhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNpbXVsYXRpb24gPSBzaW11bGF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2ltdWxhdGlvbi5zdGFnZSA9IG5ldyBQSVhJLlN0YWdlKDB4ZmZmZmZmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNpbXVsYXRpb24uYWN0b3JzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaXJjbGU6IENpcmNsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGluZTogTGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaW11bGF0aW9uLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaW11bGF0ZSh0KSB7XG4gICAgICAgIHJlcXVlc3RBbmltRnJhbWUodGhpcy5zaW11bGF0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgaWYoIXRoaXMudWkuc2ltdWxhdGlvbikgcmV0dXJuO1xuXG4gICAgICAgIHZhciBkdCA9ICh0LXRoaXMubGFzdFNpbVRpbWUpIC8gMTAwMDtcbiAgICAgICAgaWYodGhpcy51aS5pc1J1bm5pbmcpIHRoaXMudWkudGltZSArPSBkdDtcblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLmxhc3RTaW1UaW1lID0gdDtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMudWkuc2ltdWxhdGlvbi51cGRhdGUodGhpcy51aS50aW1lKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy51aS5zaW11bGF0aW9uLnN0YWdlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnVpLnNpbXVsYXRpb24pXG4gICAgfVxuXG4gICAgc2V0dXBFZGl0b3IoKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2RlXCIpLCB7XG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIHN0eWxlQWN0aXZlTGluZTogdHJ1ZSxcbiAgICAgICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmdsb2JhbC5hcHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgbmV3IEFwcCgpO1xufTsiLCJleHBvcnQgY2xhc3MgQ2lyY2xlIGV4dGVuZHMgUElYSS5HcmFwaGljcyB7XG4gICAgY29uc3RydWN0b3IoeCwgeSwgcmFkaXVzLCBsaW5lPWZhbHNlLCBjb2xvcj0weDAwMDAwMCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYmVnaW5GaWxsKGNvbG9yLCAxLjApO1xuICAgICAgICB0aGlzLmxpbmVTdHlsZSgyLCAweDAwMDAwMCwgMC40KTtcbiAgICAgICAgdGhpcy5kcmF3Q2lyY2xlKDAsIDAsIHJhZGl1cyk7XG4gICAgICAgIHRoaXMuZW5kRmlsbCgpO1xuXG4gICAgICAgIGlmKGxpbmUpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKDAsMCk7XG4gICAgICAgICAgICB0aGlzLmxpbmVUbyhyYWRpdXMsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgTGluZSBleHRlbmRzIFBJWEkuR3JhcGhpY3Mge1xuICAgIGNvbnN0cnVjdG9yKHgxLCB5MSwgeDIsIHkyLCBjb2xvcj0weDAwMDAwMCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMubGluZVN0eWxlKDIsIGNvbG9yLCAxKTtcbiAgICAgICAgdGhpcy5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgICAgdGhpcy5saW5lVG8oeDIsIHkyKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudHdvV2F5ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdG9Db21wb25lbnQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0d29XYXk6IHRoaXMudHdvV2F5LFxuICAgICAgICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUoKSxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXB1dGVkOiB0aGlzLmNvbXB1dGVkKCksXG4gICAgICAgICAgICBtZXRob2RzOiB0aGlzLm1ldGhvZHMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgY29tcHV0ZWQoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBtZXRob2RzKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxufSIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnQuanNcIjtcblxuZXhwb3J0IGNsYXNzIE1lbnVJdGVtQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50d29XYXkgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIHYtb249XCJjbGljazogb3BlblwiPjxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtaW5mbyBwdWxsLXJpZ2h0XCIgdi1pZj1cImlzRm9sZGVyXCI+e3tpc09wZW4gPyAnLScgOiAnKyd9fTwvc3Bhbj4ge3sgbW9kZWwubmFtZSB9fTwvc3Bhbj5cblxuICAgICAgICAgICAgICAgIDx1bCB2LXNob3c9XCJpc09wZW5cIiB2LWlmPVwiaXNGb2xkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiB2LXJlcGVhdD1cIm1vZGVsOiBtb2RlbC5jaGlsZHJlblwiIHYtY29tcG9uZW50PVwibWVudS1pdGVtXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNPcGVuOiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29tcHV0ZWQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc0ZvbGRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmNoaWxkcmVuICE9IHVuZGVmaW5lZCAmJiB0aGlzLm1vZGVsLmNoaWxkcmVuLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1ldGhvZHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRyb290LnNldFNpbXVsYXRpb24odGhpcy5tb2RlbC5maWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59Il19
