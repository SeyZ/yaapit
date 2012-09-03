sjcl.random.startCollectors();

function generateRandom() {
  return sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 0), 0);
}

function compress(msg) {
  return Base64.toBase64(RawDeflate.deflate(Base64.utob(msg)));
}

function decompress(msg) {
  return Base64.btou(RawDeflate.inflate(Base64.fromBase64(msg)));
}

$(document).ready(function() {

  var paste_enabled = false;

  if (window.location.pathname.match(/\/paste.*/) != null &&
      window.location.hash.charAt(0) == '#') {
      var secret_key = window.location.hash.substr(1);
      var decrypted = decompress(sjcl.decrypt(secret_key, $('pre').text()));
      $('pre').text(decrypted);
  }

  $('#pasteSubmit').click(function(event) {
    $('#pasteUrl').show();

    if (paste_enabled) {
      return;
    }
    paste_enabled = true;

    $("#pasteSubmit").attr('disabled', 'disabled');

    setTimeout(function() {

      var content = $('#pasteTa').val();
      var secret_key = generateRandom();
      var encrypted = sjcl.encrypt(secret_key, compress(content));

      $.post("/", {content: encrypted})
      .success(function(data) {
        $("#error").html('').hide();

        var url = 'http://';
        url += document.location.hostname;
        var port = document.location.port;
        if (port) {
          url += ':' + port;
        }
        url += data + '#' + secret_key;

        $('#pasteUrl').text(url);
        $('#pasteUrl').attr('href', url);
        $("#pasteSubmit").removeAttr('disabled');
        paste_enabled = false;
      }).error(function(data) {
        $('#pasteUrl').hide();

        $("#error").html('<p>' + data.responseText + '</p>').show();
        console.log("Error occured with status: " + data.status);
        $("#pasteSubmit").removeAttr('disabled');
        paste_enabled = false;
      });
    }, 100);
  });
});
