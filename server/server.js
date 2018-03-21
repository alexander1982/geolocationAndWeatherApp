let firebase = require('firebase');
let admin = require('firebase-admin');
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

admin.initializeApp({
	                    credential : admin.credential.cert('firebase-sdk.json'),
	                    databaseURL: 'https://findthelocation-46d13.firebaseio.com/'
                    });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));


console.log(PublicPath);


app.use(bodyParser.json());
//Add User
app.post('/users', (req, res) => {
	let body = _.pick(req.body, ['username', 'email', 'profile_picture', 'id']);
	let user = { name: body.username, email: body.email, picture: body.profile_picture };
	let userId = body.id;
console.log('asdasdasdasd ', user);
	firebase.database().ref(`users/${id}`).set(user);
});
//Get User
app.get('/users/:id', (req, res) => {
	let id = req.params.id;
	console.log(firebase.database().ref(`users/${id}`));
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