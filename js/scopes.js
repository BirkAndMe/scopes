/*jshint forin:false, browser:true, indent:2, trailing:true, unused:false */

var scopes = window.scopes || {};

(function (scope) {

  /**
   * Attach an event to a DOM Element.
   */
  function domEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  }

  // Event emitter is snatched from:
  // https://github.com/jeromeetienne/microevent.js
  this.on = function(event, fct){
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  };
  this.trigger = function(event /* , args... */){
    this._events = this._events || {};
    if( event in this._events === false ) return;
    for(var i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };


})(this);
