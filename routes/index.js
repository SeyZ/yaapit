var crypto = require('crypto'),
    Paste = require('../models/paste').Paste;

var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')

/* Get the home page */
exports.index = function(req, res) {
  res.render('index');
};

/* Create a new paste. */
exports.post_index = function(req, res) {

  var content = req.body.content;

  // Limit the paste size (encrypted) to ~2MB.
  var content_size = Buffer.byteLength(content, 'utf8');
  if (content_size > 2000000) {
    res.send(403, "Paste too big.");
    return;
  }

  // Generate a random token.
  generateToken(function(token) {
    var url_path = '/paste/' + token;

    var paste = new Paste({
      token: token,
      content: req.body.content
    });

    paste.save(function (err) {
      if (err) throw err;
      res.send(url_path);
    });
  });
};

/* Get a paste */
exports.get_paste = function(req, res) {
  var request = { token: req.params.token };

  Paste.findOne(request, function(err, entry) {
    if (err) throw err;
    res.render('paste', {paste: entry.content});
  });
};

var generateToken = function(callback) {
  require('crypto').randomBytes(8, function(ex, buf) {
    if (ex) throw ex;

    callback(buf.toString('hex'));
  });
};
