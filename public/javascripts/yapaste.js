$(document).ready(function() {

  var paste_enabled = false;

  if (window.location.pathname.match(/\/paste.*/) != null &&
      window.location.hash.charAt(0) == '#') {
      var secretKey = window.location.hash.substr(1);
      $('pre').text(GibberishAES.dec($('pre').text(), secretKey));
  }

  $('#pasteSubmit').click(function(event) {

    if (paste_enabled) {
      return;
    }
    paste_enabled = true;

    $("#pasteSubmit").attr('disabled', 'disabled');

    setTimeout(function() {

      var content = $('#pasteTa').val();
      var secret_key = (new Date).getTime();
      var encrypted = GibberishAES.enc(content, secret_key);

      $.post("/", {content: encrypted})
      .success(function(data) {
        $("#error").html('').hide();

        var data = data + '#' + secret_key;
        $('#pasteUrl').attr("href", data);
        $('#pasteUrl').text(data);
        $("#pasteSubmit").removeAttr('disabled');
        paste_enabled = false;
      }).error(function(data) {
        $("#error").html('<p>' + data.responseText + '</p>').show();
        console.log("Error occured with status: " + data.status);
        $("#pasteSubmit").removeAttr('disabled');
        paste_enabled = false;
      });
    }, 100);
  });
});
