var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('betsdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'Bets' database");
        db.collection('bets', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'Bets' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving bet: ' + id);
    db.collection('bets', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('bets', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addBet = function(req, res) {
    var bet = req.body;
    console.log('Adding bet: ' + JSON.stringify(bet));
    db.collection('bets', function(err, collection) {
        collection.insert(bet, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateBet = function(req, res) {
    var id = req.params.id;
    var bet = req.body;
    console.log('Updating bet: ' + id);
    console.log(JSON.stringify(bet));
    db.collection('bets', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, bet, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating bet: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(bet);
            }
        });
    });
}
 
exports.deleteBet = function(req, res) {
    var id = req.params.id;
    console.log('Deleting bet: ' + id);
    db.collection('bets', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var bets = [
    {
        nameOfBetter: "Petter",
        bet: "Din mor laver bedre mad end min mor",
        deadline: "1. juli 2014",
        price:"6 sort guld" 
    },
    {
        nameOfBetter: "Søren",
        bet: "Din far laver bedre cykler end min mor",
        deadline: "1. juni 2014",
        price:"12 sort guld" 
    }];
 
    db.collection('bets', function(err, collection) {
        collection.insert(bets, {safe:true}, function(err, result) {});
    });
 
};