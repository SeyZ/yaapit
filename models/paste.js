var mongoose = require('mongoose');
var config = require('../config').config

var db = mongoose.connect(config.database_url);

var pasteSchema = mongoose.Schema({
  token: {
    type: 'string',
    index: {unique: true}
  },
  content: 'string'
});

exports.Paste = db.model('Paste', pasteSchema);
