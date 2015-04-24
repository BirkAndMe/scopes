/*jshint forin:false, browser:true, indent:2, trailing:true, unused:false */

var scopes = this.scopes || {};

(function (root) {
  "use strict";

  // This function (and variables) handles the activation keyboard code.
  var enable_code = '', current_string = '';
  function keyEnabler(evt) {
    current_string += String.fromCharCode(evt.keyCode);

    if (current_string.length > enable_code.length) {
      current_string = current_string.substr(current_string.length - enable_code.length);
    }

    if (enable_code === current_string) {
      debug.activate();
      root.domRemoveEvent(window, 'keyup', this);
    }
  }

  /** */
  var debug_modules = {};

  /** */
  var debug = {
    /**
     *
     */
    enable: function () {
      enable_code = root.getSetting('debug').toUpperCase();
      root.domEvent(window, 'keyup', keyEnabler);
    },

    /**
     *
     */
    activate: function () {
      root.domRemoveEvent(window, 'keyup', keyEnabler);

      root.domEvent(window, 'keyup', function (evt) {
        var key = String.fromCharCode(evt.keyCode);
        if (typeof debug_modules[key] === 'function') {
          debug_modules[key]();
        }
      });


      this.godmode();
    },

    /**
     *
     */
    godmode: function () {
      var godmode = document.createElement('div');
      godmode.classList.add('scopes-debug-activated');
      document.body.appendChild(godmode);

      setTimeout(function () {
        godmode.classList.add('show');
        setTimeout(function () {
          godmode.classList.remove('show');
          setTimeout(function () {
            godmode.remove();
          }, 500);
        }, 1000);
      }, 16);
    },

    /**
     *
     */
    addModule: function (key, callback) {
      debug_modules[key.toUpperCase()] = callback;
    },
  };
  root.debug = debug;

  root.inits = root.inits || [];
  root.inits.push(function () {
    // Enable debugging (if it's enabled).
    if (root.getSetting('debug') !== false) {
      debug.enable();
    }
  });
})(scopes);
