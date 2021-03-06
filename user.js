var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User's schema
var UsersSchema = mongoose.Schema({
	id: {
		type: String,
		index: true
	},
	email: String,
	password: String,
	created_at: {
		type: Date
	}
});

var Users = module.exports = mongoose.model('Users', UsersSchema);


//Messages schema
var MessagesSchema = mongoose.Schema({
	user_id: UsersSchema,
	message_line: String,
	reciever: UsersSchema,
	status: {
		type: Boolean
	},
  	created_at: { 
  		type: Date, 
  		default: Date.now 
  	}
});

var Messages = module.exports = mongoose.model('Messages', MessagesSchema);

//Profile's schema
var ProfilesSchema = mongoose.Schema({
	user_id: UsersSchema,
	firstname: String,
	lastname: String,
	img: { 
      	data: Buffer, 
      	contentType: String 
    }
});

var Profiles = module.exports = mongoose.model('Profiles', ProfilesSchema);

//Create user
module.exports.createUser = function(newUser, callback){
	bcrypt.getSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

//Find user by id
module.exports.getUserById = function(id, callback){
	UsersSchema.findById(id, callback);
}

//compare user passwords
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}

mongoose.connect('mongodb://localhost/chatbek');
var db = mongoose.connection;
console.log('db is connected');
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));