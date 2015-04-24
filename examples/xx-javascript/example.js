$(function () {
  // This is the interesting part!
  // We listen to the change event, which is triggered by scopes.
  // The event triggers when the user either leaves or enters a scope
  // breakpoint.
  // It's important to wait for the DOM before listening to this, or you'll
  // miss the first initial change.
  scopes.on('change', function (changed, active, inactive) {

    // The chout is used to print out the list of changed scopes.
    var chout = [];
    // We run through the changed object, which holds a list of the scopes that
    // has changed state. It holds the complete scope object keyed by the scope
    // name.
    for (var i in changed) {
      chout.push(formatScopeName(i) + ' ' + (changed[i].state ? 'IN' : 'OUT'));
    }

    // Nothing fancy, prepend the debugging message.
    jsout('<div class="label">scopes.on(\'change\', function () { ... })</div>' + '  ' + chout.join('\n  '));
  });


  // Shows you how to get a list of the currently active scopes.
  window.showActiveScopes = function () {
    var
      active_scopes = scopes.getScopes(scopes.STATE_ACTIVE),

      // Make the output pretty.
      out = Object.keys(active_scopes).map(function (v) { return formatScopeName(v); }).join(', ');

    jsout('<span class="label">scopes.getScopes(scopes.STATE_ACTIVE)</span> ' + out);
  };


  // A simple check to see if a scope is active.
  window.checkAScope = function (scope_name) {
    var is_active = scopes.checkScope(scope_name);
    jsout('<span class="label">scopes.checkScope(' + formatScopeName(scope_name) + ')</span> ' + is_active);
  }


  // ---- Nothing of interest past this point ---------------------------------

  // Output function
  var
    $jsout = $('#jsout'),
    ping_timeout = 0;
  function jsout(message) {
    $jsout
      .prepend('<div class="message">'  + message + '</div>')
      .addClass('ping');

    clearTimeout(ping_timeout);
    ping_timeout = setTimeout(function () {
      $jsout.removeClass('ping');
    }, 400);
  }

  function formatScopeName(scope_name) {
    return '<a href="javascript:checkAScope(\'' + scope_name + '\')">' + scope_name + '</a>';
  }
});
