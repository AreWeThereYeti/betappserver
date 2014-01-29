var express = require('express');
bets = require('./routes/bets');
 
var app = express();
 
app.configure(function () {
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
});
 
app.get('/bets', bets.findAll);
app.get('/bets/:id', bets.findById);
app.post('/bets', bets.addBet);
app.put('/bets/:id', bets.updateBet);
app.delete('/bets/:id', bets.deleteBet);
 
app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000...');