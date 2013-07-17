'use strict';
var crypto = require('crypto');
var levelup = require('level');
var db = levelup('./yaap.db');

var generateToken = function(callback) {
  crypto.randomBytes(8, function(ex, buf) {
    if (ex) throw ex;
    callback(buf.toString('hex'));
  });
};

/* Get the home page */
exports.index = function(req, res) {
  res.render('index');
};

/* Create a new paste. */
exports.post_index = function (req, res) {
  var content = req.body.content;
  var burn = req.body.burn;

  // Limit the paste size (encrypted) to ~2MB.
  var contentSize = Buffer.byteLength(content, 'utf8');
  if (contentSize > 2000000) { return res.send(403, 'Paste too big.'); }

  // Generate a random token.
  generateToken(function(token) {
    var urlPath = '/paste/' + token;
    var data = {
      content: req.body.content,
      burn: burn === 'true',
    };

    db.put(token, data, {
      valueEncoding: 'json'
    }, function(err) {
      if (err) { return res.send(500); }
      res.send(urlPath);
    });
  });
};

/* Get a paste */
exports.get_paste = function (req, res) {
  db.get(req.params.token, {
    valueEncoding: 'json'
  }, function (err, entry) {
    if (entry) {
      if (entry.burn) {
        db.del(req.params.token);
      }
      res.render('paste', { paste: entry.content });
    } else {
      res.send(404);
    }
  });
};
