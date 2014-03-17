

var mongo = require('mongodb');



var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/auth';

mongo.MongoClient.connect(mongoUri, function(err, db) {
    if(!err) {
        console.log("Connected to 'Auth' database");
        db.collection('auth', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'Auth' collection doesn't exist. Creating it with sample data...");
                
				var user = [
							{
						        user_id: "tlf",
						        token: "md5(kode+tlf)"
						    }];
 
			    db.collection('auth', function(err, collection) {
			        collection.insert(user, {safe:true}, function(err, result) {});
			    });
            }
            
        });
    }
});


exports.addUser = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
		    var user = req.body;
		    console.log('Adding User: ' + JSON.stringify(auth)); // should be removed before production!!!!!!!!
		    db.collection('auth', function(err, collection) {
		        collection.insert(user, {safe:true}, function(err, result) {
		            if (err) {
		                res.send({'error':'An error has occurred'});
		            } else {
		                console.log('Success: ' + JSON.stringify(result[0]));
		                res.send(result);
		            }
		        });
		    });
		}
	});    
}

exports.findAll = function(req, res) {
    mongo.MongoClient.connect(mongoUri, function(err, db) {
	    if(!err) {
	        console.log("Connected to 'Auth' database");
	        db.collection('auth', {strict:true}, function(err, collection) {
	        	collection.find().toArray(function(err, items) {
	            	res.send(items);
				});
			});
		}
	});
};
