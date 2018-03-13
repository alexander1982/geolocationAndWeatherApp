import axios from 'axios';
import firebase from 'firebase';
import { store } from '../index';

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

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = process.env.GOOGLE_MAP_API_KEY;
export const CLEAN_STATE = 'clean_state';
export const FETCH_GEOLOCATION = 'fetch_geoLocation';
export const FETCH_WEATHER = 'fetch_weather';
export const TOGGLE_MODAL = 'toggle_modal';
export const TOGGLE_NAV_BAR = 'toggle_nav_bar';

firebase.auth().useDeviceLanguage();
let provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.addScope('profile');
provider.addScope('email');

firebase.auth().onAuthStateChanged(function(user) {
	if(user){
		console.log('Account linking success', user);
		document.cookie = `OAuth=${user.G}`;
	} else {
		signInWitGoogle().then(response => {
			console.log(response);
		}, error => {
			console.log(error);
		});
	}
});

export function Register() {
	let email = process.env.EMAIL;
	let password = process.env.PASSWORD;

	if(!email || !password){
		console.log('No password or email');
	}

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
		console.log('register error', error);
		if(error.code === 'auth/email-already-in-use'){
			let credential = firebase.auth.EmailAuthProvider.credential(email, password);

			signInWitGoogle().then(() => {
				firebase.auth().currentUser.link(credential).then(user => {
					console.log('Account linking success', user);
				}, error => {
					console.log('Account linking error', error);
				})
			})
		}
	})
}

export function SignIn() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			signInWitGoogle();
			console.log('Account linking success', user);
		} else {
			firebase.auth().signInWithPopup(provider).then(function(result) {
				// This gives you a Google Access Token.
				var token = result.credential.accessToken;
				// The signed-in user info.
				var user = result.user;
			});
			console.log('No User around');
		}
	})
}

export function signInWitGoogle() {
	let provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	provider.addScope('profile');
	provider.addScope('email');

	return firebase.auth().signInWithRedirect(provider).catch(error => {
		console.log('Google sign in error', error);
	})
}

export function SignOut() {
	firebase.auth().signOut().then(response => {
		document.cookie = "OAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		console.log('Signed out');
	}, error => {
		console.log('Some error ', error);
	});
}

export function fetchGeoLocation(values) {
	const url = `${BASE_URL}?address=${values.street},+${values.city},+${values.country}&key=${API_KEY}`;
	const request = axios.get(url).then(
	response => {
		if(response.data.status !== 'OK'){
			store.dispatch(toggleModalAction());
		}
		console.log('Fetch Geo result', response);
		return response
	},
	error => {
		console.log(error);
	}
	);

	return {
		type   : FETCH_GEOLOCATION,
		payload: request
	}
}

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const OPEN_WEATHER_BASE_URL = `http://api.openweathermap.org/data/2.5/forecast`;
export function fetchWeather(values) {
	const url = `${OPEN_WEATHER_BASE_URL}?lat=${values.lat}&lon=${values.lng}&appid=${OPEN_WEATHER_KEY}`;
	const request = axios.get(url).then(
	response => response,
	error => {
		console.log(error)
	}
	);

	return {
		type   : FETCH_WEATHER,
		payload: request
	}
}

export function setUser(name, age, id) {

	let user = { name, age, id };
	axios.post('/users', user);
}

export function setLocation(id, location) {
	let user = { id, location };
	axios.post(`/users/${id}`, user);
}

export function toggleModalAction() {
	return {
		type: TOGGLE_MODAL
	}
}

export function cleanState() {
	return {
		type: CLEAN_STATE
	}
}

export function toggleNavBarAction() {
	return {
		type: TOGGLE_NAV_BAR
	}
}