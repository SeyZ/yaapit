
// Start the SJCL random collectors.
sjcl.random.startCollectors();

/* Generates a random string and returns it */
function generateRandom() {
  return sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 0), 0);
}

/* Compresses the msg and returns it */
function compress(msg) {
  return Base64.toBase64(RawDeflate.deflate(Base64.utob(msg)));
}

/* Decompresses the msg and returns it */
function decompress(msg) {
  return Base64.btou(RawDeflate.inflate(Base64.fromBase64(msg)));
}

/* Returns true if the url location is /paste + something or not. */
function is_paste_page() {
  return window.location.pathname.match(/\/paste.*/) !== null;
}

/* Returns the anchor of the url (in our case, the secret key) or null. */
function get_secret_key() {
  if (window.location.hash.charAt(0) == '#') {
    return window.location.hash.substr(1);
  }

  return null;
}

/* Returns the full url with the token and the secret key. */
function get_url(token, secret_key) {
  var url = 'http://';
  url += document.location.hostname;
  var port = document.location.port;
  if (port) {
    url += ':' + port;
  }
  url += token + '#' + secret_key;

  return url;
}

$(document).ready(function() {

  // Paste page ?
  if (is_paste_page()) {
    // Get the secret key.
    var secret_key = get_secret_key();
    try {
      // Decrypt the message and display it in the pre tag.
      var decrypted = decompress(sjcl.decrypt(secret_key, $('pre').text()));
      $('pre').text(decrypted);
    } catch (err) {
      // For now, error is just an empty paste text.
      $('pre').text('');
    }
  }

  // A flag to indicate if a paste task is running or not.
  var paste_enabled = false;

  $('#pasteSubmit').click(function(event) {
    // If a paste task is already running, ignore the click.
    if (paste_enabled) {
      return;
    }

    // Set the paste flag to true. A paste task is now running.
    paste_enabled = true;

    // Disable the paste button.
    $("#pasteSubmit").attr('disabled', 'disabled');

    // We wait 100ms in order to be sure that the animation of the disable
    // paste submit button is done.
    setTimeout(function() {
      var content = $('#pasteTa').val();
      var secret_key = generateRandom();
      var encrypted = sjcl.encrypt(secret_key, compress(content));

      $.post("/", {content: encrypted}).success(function(data) {
        $("#error").html('').hide();

        var url = get_url(data, secret_key);
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
