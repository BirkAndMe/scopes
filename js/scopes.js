/*jshint forin:false, browser:true, indent:2, trailing:true, unused:false */

var scopes = this.scopes || {};

(function (root) {
  "use strict";

  var
    /** */
    _scopes = {},

    /** */
    _settings = {};

  /** */
  root.STATE_ACTIVE = true;
  /** */
  root.STATE_INACTIVE = false;

  // --------------------------------------------------------------------------
  // Event handler snatched from:
  // http://ejohn.org/projects/flexible-javascript-events/
  root._domEvent = function( obj, type, fn ) {
    if ( obj.attachEvent ) {
      obj['e'+type+fn] = fn;
      obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
      obj.attachEvent( 'on'+type, obj[type+fn] );
    } else
      obj.addEventListener( type, fn, false );
  };
  root._domRemoveEvent = function( obj, type, fn ) {
    if ( obj.detachEvent ) {
      obj.detachEvent( 'on'+type, obj[type+fn] );
      obj[type+fn] = null;
    } else
      obj.removeEventListener( type, fn, false );
  };

  // --------------------------------------------------------------------------
  // Event emitter is snatched from:
  // https://github.com/jeromeetienne/microevent.js
  var _events = {};
  root.on = function(event, fct){
    _events[event] = _events[event] || [];
    _events[event].push(fct);
  };
  root.trigger = function(event){
    if( event in _events === false ) return;
    for(var i = 0; i < _events[event].length; i++){
      _events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };

  // --------------------------------------------------------------------------
  // Actual scopes js
  /**
   *
   */
  root._createScope = function(scope_name, data) {
    var element = document.createElement('div');
    element.classList.add('scope-scope');
    element.id = 'scope-' + scope_name;

    root._check_container.appendChild(element);

    return {
      name: scope_name,
      state: null,
      data: data
    };
  };

  /**
   *
   */
  root.getScope = function (scope_name) {
    return _scopes[scope_name];
  };

  /**
   *
   */
  root.getScopes = function(state) {
    var buffer = {};
    for (var i in _scopes) {
      if (state === undefined || _scopes[i].state === state) {
        buffer[i] = _scopes[i];
      }
    }
    return buffer;
  };

  /**
   * Check if a scope is active.
   */
  root.isActive = function (scope_name) {
    var element = document.getElementById('scope-' + scope_name);

    if (element === null) {
      return false;
    }

    return window.getComputedStyle(element).top === '1px';
  };

  /**
   * @deprecated Use the isActive() function instead.
   */
  root.checkScope = function (scope_name) {
    return this.isActive(scope_name);
  };

  /**
   *
   */
  root._handleResize = function () {
    var
      active = {},
      inactive = {},
      changed = {};

    for (var scope in _scopes) {
      if (this.checkScope(scope) === root.STATE_ACTIVE) {
        active[scope] = _scopes[scope];

        if (_scopes[scope].state !== root.STATE_ACTIVE) {
          changed[scope] = _scopes[scope];
        }
        _scopes[scope].state = root.STATE_ACTIVE;

      } else {
        inactive[scope] = _scopes[scope];

        if (_scopes[scope].state !== root.STATE_INACTIVE) {
          changed[scope] = _scopes[scope];
        }
        _scopes[scope].state = root.STATE_INACTIVE;
      }
    }

    if (Object.keys(changed).length > 0) {
      this.trigger('change', changed, active, inactive);
    }
  };

  /**
   * Get a setting.
   */
  root.getSetting = function (name) {
    if (_settings[name]) {
      return _settings[name];
    }

    return false;
  };

  /**
   *
   */
  root.inits = root.inits || [];

  // --------------------------------------------------------------------------
  // Initialize
  function initialize() {
    // Catering for jshint!
    var i;

    // Parse the sass JSON data.
    var data = window.getComputedStyle(document.body, ':after')
      .getPropertyValue('content')
      .replace(/\\"/g, '"');
    if (data === 'none') {
      return;
    }
    data = JSON.parse(data.substr(0, data.length - 1).substr(1));

    // Default the _check_container back to document.body
    if (root._check_container === undefined) {
      root._check_container = document.body;
    }

    // Run through the data, setting the scopes and the settings.
    for (i in data) {
      // A variable starts with a _
      if (i.substr(0, 1) === '_') {
        _settings[i.substr(1)] = data[i];
      } else {
        _scopes[i] = root._createScope(i, data[i]);
      }
    }

    // Prepare our resize function, so we can trigger the scopes change event.
    root._domEvent(window, 'resize', function () {
      root._handleResize();
    });
    root._handleResize();

    // Init
    for (i in root.inits) {
      if (typeof root.inits[i] === 'function') {
        root.inits[i]();
      }
    }
  }

  // Initialize scopes
  // http://www.stevesouders.com/blog/2014/09/12/onload-in-onload/
  if (document.readyState === 'complete') {
    initialize();
  }
  else {
    root._domEvent(window, 'load', initialize);
  }

})(scopes);
