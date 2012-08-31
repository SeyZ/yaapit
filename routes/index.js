var crypto = require('crypto'),
    Paste = require('../models/paste').Paste;

var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')

/* Get the home page */
exports.index = function(req, res) {
  res.render('index');
};

/* Create a new paste. */
exports.post_index = function(req, res) {

  // Generate a random token.
  generateToken(function(token) {
    // Generate the secret key.
    generateToken(function(secretKey) {
      var url_path = '/paste/' + token + '-' + secretKey;

      var content = req.body.content;
      var cipher = crypto.createCipher('aes-256-cbc', secretKey);
      var crypted = cipher.update(content, 'utf8', 'hex');
      crypted += cipher.final('hex')

      var paste = new Paste({
        token: token,
        content: crypted
      });

      paste.save(function (err) {
        if (err) throw err;
        res.send(url_path);
      });
    });
  });
};

/* Get a paste */
exports.get_paste = function(req, res) {
  var magic = req.params.magic;

  var token = magic.split('-')[0]
  var secretKey = magic.split('-')[1]

  var request = { token: token };

  Paste.findOne(request, function(err, entry) {
    if (err) throw err;

    try {
      var decipher = crypto.createDecipher('aes-256-cbc', secretKey);
      var dec = decipher.update(entry.content,'hex','utf8');
      dec += decipher.final('utf8');
    } catch(e) {
      res.send(404);
      return;
    }

    res.render('paste', {paste: dec});
  });
};

var generateToken = function(callback) {
  require('crypto').randomBytes(8, function(ex, buf) {
    if (ex) throw ex;

    callback(buf.toString('hex'));
  });
};
