// local setup


var mongo = require('mongodb');



// mongolab on heroku or local

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/bets';

mongo.MongoClient.connect(mongoUri, function(err, db) {
    if(!err) {
        console.log("Connected to 'Bets' database");
        db.collection('bets', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'Bets' collection doesn't exist. Creating it with sample data...");
                
                    var bets = [
								{
							        participant: "Petter",
							        bet: "Din mor laver bedre mad end min mor",
							        deadline: "1. juli 2014",
							        price:"6 sort guld",
							        author: "Mikkel"
							         
							    },
							    {
							        participant: "Søren",
							        bet: "Din far laver bedre cykler end min mor",
							        deadline: "1. juni 2014",
							        price:"12 sort guld",
							        author: "Petter" 
							    }];
 
			    db.collection('bets', function(err, collection) {
			        collection.insert(bets, {safe:true}, function(err, result) {});
			    });
            }
            
        });
    }
});



// Finds and returns all bets where 'username' is either author or participant 

exports.findBetsForUser = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {    
		    var username = req.params.username;
		    console.log('Retrieving bets made by and with: ' + username);
		    
		    db.collection('bets', {strict:true}, function(err, collection) {
		        collection.find({  $or:[{author: username}, {participant: username}] }).toArray(function(err, items) {
		            res.send(items);
		        });
		    });
    	}
	});

};

 
exports.findAll = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
	        console.log("Connected to 'Bets' database");
	        db.collection('bets', {strict:true}, function(err, collection) {
	        	collection.find().toArray(function(err, items) {
	            	res.send(items);
				});
			});
		}
	});
};
 
exports.addBet = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
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
	});    
};
 
exports.updateBet = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
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
	});  
};
 
exports.deleteBet = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
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
	});  
};
 

