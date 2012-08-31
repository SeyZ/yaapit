$(document).ready(function() {

  if (window.location.pathname.match(/\/paste.*/) != null &&
      window.location.hash.charAt(0) == '#') {
      var secretKey = window.location.hash.substr(1);
      $('pre').text(GibberishAES.dec($('pre').text(), secretKey));
  }

  $('#pasteSubmit').click(function(event) {
    var content = $('#pasteTa').val();
    var secret_key = (new Date).getTime();
    var encrypted = GibberishAES.enc(content, secret_key);

    $.post("/", {content: encrypted})
      .success(function(data) {
        var data = data + '#' + secret_key;
        $('#pasteUrl').attr("href", data);
        $('#pasteUrl').text(data);
      }).error(function(data) {
        console.log("Error occured with status: " + data.status);
      });
  });
});
