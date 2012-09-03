var db = require('dirty')('yaap.db');

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

    db.set(token, { content: req.body.content }, function() {
      res.send(url_path);
    });
  });
};

/* Get a paste */
exports.get_paste = function(req, res) {

  var entry = db.get(req.params.token);
  if (entry) {
    res.render('paste', { paste: entry.content });
  } else {
    res.send(404);
  }
};

var generateToken = function(callback) {
  require('crypto').randomBytes(8, function(ex, buf) {
    if (ex) throw ex;

    callback(buf.toString('hex'));
  });
};
