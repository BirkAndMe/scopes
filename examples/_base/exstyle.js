$(function () {
  var promises = [];

  $('.loadcode').each(function () {
    var
      $element = $(this),
      deferred = new $.Deferred();

    $.ajax($element.text(), {
      dataType : 'text',
      success: function (data) {
        $element.text(data);
        deferred.resolve();
      }
    });

    promises.push(deferred);
  });

  $.when.apply(undefined, promises).then(function () {
    requestAnimationFrame(function () {
      prettyPrint();
    });
  });

  $('a.example-link').each(function () {
    var $element = $(this);
    $element.attr('href', '../' + $element.text() + '/example.html');
  });

  document.title = /.*\/(.+)-(.+)\//.exec(location.href)[1] + ' - ' + document.title;
});
