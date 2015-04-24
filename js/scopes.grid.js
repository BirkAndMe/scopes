/*jshint forin:false, browser:true, indent:2, trailing:true, unused:false */

var scopes = this.scopes || {};

(function (root) {
  "use strict";

  var
    /** */
    _visible = false,

    /** */
    max_count = 0;

  var grid = {
    hide: function () {
      _visible = false;

      // var outers = document.getElementsByClassName('scopes-debug-grid');
      // for (var i = 0; i < outers.length; i++) {
      //   outers[i].remove();
      // }

      document.body.classList.remove('scopes-show-grid');
    },

    show: function () {
      _visible = true;

      if (document.getElementsByClassName('scopes-debug-grid').length === 0) {
        var
          outer = document.createElement('div'),
          container = document.createElement('div'),
          single = document.createElement('div');

        outer.classList.add('scopes-debug-grid');
        container.classList.add('grid-container');
        single.classList.add('single-grid');

        for (var x = 0; x < max_count; x++) {
          container.appendChild(single.cloneNode());
        }

        outer.appendChild(container);
        document.body.appendChild(outer);
      }

      document.body.classList.add('scopes-show-grid');
    },

    toggleVisibility: function () {
      if (_visible === false) {
        this.show();
      } else {
        this.hide();
      }
    }
  };
  root.grid = grid;

  root.inits = root.inits || [];
  root.inits.push(function () {
    var scopes = root.getScopes();
    for (var i in scopes) {
      max_count = Math.max(max_count, scopes[i].data.grid.count);
    }

    if (root.debug !== undefined) {
      root.debug.addModule('G', function () {
        root.grid.toggleVisibility()
      });
    }
  });
})(scopes);
