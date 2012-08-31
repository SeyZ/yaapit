var mongoose = require('mongoose');


var db = mongoose.connect('mongodb://nodejitsu:67839f670021664a77d55d370ebe90f3@alex.mongohq.com:10075/nodejitsudb836871408122');
//var db = mongoose.createConnection('localhost', 'yaaapaste');

var pasteSchema = mongoose.Schema({
  token: {
    type: 'string',
    index: {unique: true}
  },
  content: 'string'
});

exports.Paste = db.model('Paste', pasteSchema);
