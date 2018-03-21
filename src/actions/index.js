import axios from 'axios';
import firebase from 'firebase';
import { store } from '../index';
import $ from 'jquery';

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

firebase.auth().getRedirectResult().then(result => {

	if(result.credential){
		// This gives you a Google Access Token. You can use it to access the Google API.
		let token = result.credential.accessToken;
		document.cookie = `OAuth=${token}`;
		let user = { name: result.user.displayName, email: result.user.email, picture: result.user.photoURL, locations: [{ lat: 2, lng: 2, city: 'Never', country: 'Neverhood', street: 'Neverland' }] };
		let userId = result.user.uid;

		firebase.database().ref(`users/${userId}`).set(user);

		console.log(result);
	}
	console.log('Account linking success', result);
	// The signed-in user info.
	let user = result.user;
}).catch(error => {
	console.log('Account linking success', error);
	// Handle Errors here.
	let errorCode = error.code;
	let errorMessage = error.message;
	// The email of the user's account used.
	let email = error.email;
	// The firebase.auth.AuthCredential type that was used.
	let credential = error.credential;
	// ...
});

export function Register() {
	signInWitGoogle().then(() => {
		firebase.auth().currentUser.link(credential);
		createUser();
	})
}

export function SignIn() {
	firebase.auth().onAuthStateChanged(user => {
		if(user){
			console.log('Account linking success', user);
			document.cookie = `OAuth=${user.G}`;
		} else {
			signInWitGoogle();
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

export function setLocationToMyLocations(location) {
	firebase.auth().getRedirectResult().then(result => {

		let locationsArray = [];
		let userId = result.user.uid;
		let leadsRef = firebase.database().ref(`users/${userId}/locations`);
		leadsRef.on(`value`, (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				locationsArray.push(childSnapshot.val());
				locationsArray = [...locationsArray, location];
			});
		});
		// The signed-in user info.
	}).catch(error => {
		console.log('Account linking error', error);
		// Handle Errors here.
		let errorCode = error.code;
		let errorMessage = error.message;
		// The email of the user's account used.
		let email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		let credential = error.credential;
		// ...
	});
}

export function removeLocationFromMyLocations(params) {
	firebase.auth().getRedirectResult().then(result => {

		let locationsArray = [];
		let userId = result.user.uid;
		let leadsRef = firebase.database().ref(`users/${userId}/locations`);
		leadsRef.on(`value`, (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				locationsArray.push(childSnapshot.val());
				locationsArray = locationsArray.filter((place) => {
					return params.lat !== place.lat && params.lng !== place.lng;
				});
				console.log(locationsArray);
			});
		});
		// The signed-in user info.
	}).catch(error => {
		console.log('Account linking error', error);
		// Handle Errors here.
		let errorCode = error.code;
		let errorMessage = error.message;
		// The email of the user's account used.
		let email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		let credential = error.credential;
		// ...
	});
}

export function getMyLocations() {
	firebase.auth().getRedirectResult().then(result => {

		let locationsArray = [];
		let userId = result.user.uid;
		let leadsRef = firebase.database().ref(`users/${userId}/locations`);
		leadsRef.on(`value`, (snapshot) => {
			snapshot.forEach((childSnapshot) => {
				locationsArray.push(childSnapshot.val());
			});
		});
		// The signed-in user info.
	}).catch(error => {
		console.log('Account linking error', error);
		// Handle Errors here.
		let errorCode = error.code;
		console.log('Account linking error', error.code);
		let errorMessage = error.message;
		// The email of the user's account used.
		let email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		let credential = error.credential;
		// ...
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