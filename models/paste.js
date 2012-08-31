var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'yaaapaste');

var pasteSchema = mongoose.Schema({
  token: {
    type: 'string',
    index: {unique: true}
  },
  content: 'string'
});

exports.Paste = db.model('Paste', pasteSchema);
