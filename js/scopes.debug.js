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
      root._domRemoveEvent(window, 'keyup', this);
    }
  }

  /** */
  var debug_modules = {};

  /** */
  var debug = {
    /**
     * Enables debugging.
     *
     * This doesn't activate debugging, you still need to press the "secret"
     * key sequence to activate debugging.
     */
    enable: function () {
      enable_code = root.getSetting('debug').toUpperCase();
      root._domEvent(window, 'keyup', keyEnabler);
    },

    /**
     * This will activate the debugging modules.
     */
    activate: function () {
      root._domRemoveEvent(window, 'keyup', keyEnabler);

      root._domEvent(window, 'keyup', function (evt) {
        var key = String.fromCharCode(evt.keyCode);
        if (typeof debug_modules[key] === 'function') {
          debug_modules[key]();
        }
      });


      this.godmode();
    },

    /**
     * Notify the user they have activated debugging.
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
     * Add different modules to the debugging.
     *
     * A module consists of a single key (which is pressed to activate it), and
     * a callback function, that handles what ever needs handling.
     *
     * @param {String} key
     *   The key that activates the module.
     * @param {Function} callback
     *   Function called, when the key is pressed.
     */
    addModule: function (key, callback) {
      debug_modules[key.toUpperCase()] = callback;
    },
  };
  root.debug = debug;

  // Hook into the scopes inits.
  root.inits = root.inits || [];
  root.inits.push(function () {
    // Check with the scopes settings to see if debugging is enabled.
    if (root.getSetting('debug') !== false) {
      debug.enable();
    }
  });
})(scopes);
