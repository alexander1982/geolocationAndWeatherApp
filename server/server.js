let firebase = require('firebase');
let path = require('path');
let _ = require('lodash');
let bodyParser = require('body-parser');
let express = require('express');

const publicPath = path.join(__dirname, '../dist');
const envFile = require('node-env-file');
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

try {
	envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'));
} catch(e) {

}

try {
	let config = {
		apiKey           : process.env.FIREBASE_API_KEY,
		authDomain       : process.env.FIREBASE_AUTH_DOMAIN,
		databaseURL      : process.env.FIREBASE_DATABASE_URL,
		projectId        : process.env.FIREBASE_PROJECT_ID,
		storageBucket    : process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
	};
	firebase.initializeApp(config);
} catch(e) {

}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(bodyParser.json());
//Add User
app.post('/users', (req, res) => {
	let body = _.pick(req.body, ['name', 'age', 'id']);
	let user = { name: body.name, age: body.age };

	firebase.database().ref('users/' + body.id).set(user);
});
//Get User
app.get('/users/user/:id', (req, res) => {
	let id = req.params.id;
	
});
//Add Location
app.post('/users/:id', (req, res) => {
	let body = _.pick(req.body, ['id', 'location']);
	let place = { lat: body.location.lat, lng: body.location.lng };

	let newLocation = firebase.database().ref().child('users').push().key;

	let updates = {};
	updates['/users/' + body.id + '/locations' + '/' + newLocation] = place;

	firebase.database().ref().update(updates);
});

app.listen(port, () => {
	console.log(`Server is running on port`, port)
});

module.exports = { app };