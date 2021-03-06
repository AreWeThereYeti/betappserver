var express = require('express');
cors = require('cors');
bets = require('./routes/bets');
auth = require('./routes/auth');
 
var app = express();
 
app.configure(function () {
  app.use(cors());
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
});
 
app.get('/bets', bets.findAll);
app.get('/bets/:username', bets.findBetsForUser);
app.post('/bets', bets.addBet);
app.put('/bets/:id', bets.updateBet);
app.delete('/bets/:id', bets.deleteBet);

app.post('/auth', auth.addUser);
app.get('/auth', auth.findAll);   /* primarily for debugging purposes  */
 

app.listen( process.env.PORT || 3000);
console.log('Listening on port 3000...');

