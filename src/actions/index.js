import axios from 'axios';
import firebase from 'firebase';
import { store } from '../index';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

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
export const CLEAN_USER_STATE = 'clean_user_state';
export const CLEAN_WEATHER_STATE = 'clean_weather_state';
export const FETCH_GEOLOCATION = 'fetch_geoLocation';
export const FETCH_WEATHER = 'fetch_weather';
export const TOGGLE_MODAL = 'toggle_modal';
export const TOGGLE_NAV_BAR = 'toggle_nav_bar';
export const SET_USER = 'set_user';
export const UNSET_USER = 'unset_user';
export const SET_LOCATIONS_TO_STATE = 'set_locations_to_state';
export const SET_SINGLE_LOCATION_TO_STATE = 'set_single_location_to_state';
export const UNSET_SINGLE_LOCATION_FROM_STATE = 'unset_single_location_from_state';
export const CLEAN_MY_LOCATIONS = 'clean_my_locations';

firebase.auth().useDeviceLanguage();
let provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.addScope('profile');
provider.addScope('email');

firebase.auth().onAuthStateChanged(user => {
	if(user){
		getUser(user.uid);
	}
});

firebase.auth().getRedirectResult().then(result => {
	if(result.credential){
		let user = { name: result.user.displayName, email: result.user.email, picture: result.user.photoURL };
		let userId = result.user.uid;
		firebase.database().ref(`users/${userId}`).set(user);
	}
}).catch(error => {
	console.log('Account linking error', error);
});

function setUserToState(userProfile) {
	return {
		type   : SET_USER,
		payload: userProfile
	}
}

export function unsetUserFromState() {
	return {
		type: CLEAN_USER_STATE
	}
}

export function getUser(userId) {
	console.log('Gettin');
	let userProfile = {};
	let databaseLocations = null;
	let myLocations = [];
	//let leadsRef = firebase.database().ref(`users/${userId}`);
	return firebase.database().ref(`/users/${userId}`).once('value').then(snapshot => {
		console.log('snapshot.val().locations ', snapshot.val());
		userProfile = {
			email  : snapshot.val().email,
			name   : snapshot.val().name,
			picture: snapshot.val().picture
		};
		store.dispatch(setUserToState(userProfile));

		if(snapshot.val().locations !== undefined){
			databaseLocations = snapshot.val().locations;
			for(let key in databaseLocations){
				let theLocation = {};
				theLocation = { [key]: databaseLocations[key] };
				console.log('theLocation ', theLocation);
				myLocations.push(theLocation);
			}
			console.log('myLocations ', myLocations);
			store.dispatch(setLocationsToState(myLocations));
		}
	});
	//leadsRef.on(`value`, (snapshot) => {
	//	snapshot.forEach((childSnapshot) => {
	//		stateUser[childSnapshot.key] = childSnapshot.val();
	//	});
	//	if(stateUser.name !== undefined){
	//		userProfile = {
	//			email  : stateUser.email,
	//			name   : stateUser.name,
	//			picture: stateUser.picture
	//		};
	//	}
	//	store.dispatch(setUserToState(userProfile));
	//	if(stateUser.locations !== undefined){
	//		console.log('stateUser.locations !== undefined ', stateUser.locations);
	//		databaseLocations = stateUser.locations;
	//		for(let key in databaseLocations){
	//			let theLocation = {};
	//			theLocation = { [key]: databaseLocations[key] };
	//			console.log('theLocation ', theLocation);
	//			myLocations.push(theLocation);
	//		}
	//		console.log('myLocations ', myLocations);
	//		var uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
	//		let someArrr = uniqueArray(myLocations);
	//		console.log('uniqEs6 ', someArrr);
	//		store.dispatch(setLocationsToState(someArrr));
	//	}
	//});
}
export function signInWithGoogle() {
	return firebase.auth().signInWithRedirect(provider).catch(error => {
		console.log('Google sign in error', error);
	})
}

export function Register() {
	signInWitGoogle().then(() => {
		firebase.auth().currentUser.link(credential);
	})
}

export function signIn() {
	let User = firebase.auth().currentUser;
	if(User){
		getUser(User.uid);
	}
}

export function signOut() {
	store.dispatch(unsetUserFromState());
	firebase.auth().signOut().then(() => {
		console.log('Signed out');
	}, error => {
		console.log('SignOut error ', error);
	});
}

export function updateUserProfile(updatedUser) {
	let user = firebase.auth().currentUser;
	user.updateProfile({
		                   name   : updatedUser.username,
		                   email  : updatedUser.email,
		                   picture: updatedUser.picture
	                   }).then(() => {

	}).catch((error) => {
		console.log('Update error ', error);
	})
}

export function setLocationToMyLocations(newLocation) {
	let savedLocations = [];
	let savedLocations_2 = [];
	let formatted_location = {};
	let duplicateCheck = true;
	let makeId = (b) => {
		let s = Math.floor((b.lat + b.lng) * 100000000);
		s.toString();
		console.log('s', s);
		return s;
	};

	formatted_location.city = newLocation.city;
	formatted_location.country = newLocation.country;
	formatted_location.street = newLocation.street;
	formatted_location.formatted_address = newLocation.formatted_address;
	formatted_location.lat = newLocation.lat;
	formatted_location.lng = newLocation.lng;

	let userId = firebase.auth().currentUser.uid;
	if(userId){
		return firebase.database().ref(`/users/${userId}`).once('value').then(snapshot => {
			if(snapshot.val().locations == undefined){
				let newId = makeId(newLocation);
				firebase.database().ref(`/users/${userId}/locations/${newId}`).set(formatted_location).then(() => {
					return firebase.database().ref(`/users/${userId}`).once('value').then(snapshot => {
						if(snapshot.val().locations){
							_.map(snapshot.val().locations, (value, key) => {
								let obj = {};
								obj[key] = value;
								savedLocations.push(obj);
							});
							store.dispatch(setLocationsToState(savedLocations));
						}
					})
				});
			} else {
				savedLocations = snapshot.val().locations;
				_.map(savedLocations, (value, key) => {
					if(savedLocations[key] !== formatted_location){
						duplicateCheck = false;
					}
				});

				if(!duplicateCheck){
					let newId = makeId(newLocation);
					firebase.database().ref(`/users/${userId}/locations/${newId}`).set(formatted_location);
					return firebase.database().ref(`/users/${userId}`).once('value').then(snapshot => {
						if(snapshot.val().locations){
							_.map(snapshot.val().locations, (value, key) => {
								let obj = {};
								obj[key] = value;
								savedLocations_2.push(obj);
							});
							store.dispatch(setLocationsToState(savedLocations_2));
						}
					})
				}
			}
		});
	}
}

export function removeLocationFromMyLocations(location) {
	let savedLocations = [];
	let locationId = null;
	let userId = firebase.auth().currentUser.uid;

	if(userId){
		return firebase.database().ref(`/users/${userId}`).once('value').then(function(snapshot) {
			_.map(snapshot.val().locations, (value, key) => {
				if(snapshot.val().locations[key] !== location){
					locationId = key;
				}
			});
			if(locationId){
				firebase.database().ref(`/users/${userId}/locations`).child(locationId).remove();
				return firebase.database().ref(`/users/${userId}`).once('value').then(snapshot => {
					if(snapshot.val().locations == undefined) {
						console.log('snapshot.val().locations ', snapshot.val());
						return store.dispatch(setLocationsToState(null));
					} else {
						console.log('snapshot.val().locations ', snapshot.val().locations);
						_.map(snapshot.val().locations, (value, key) => {
							let obj = {};
							obj[key] = value;
							savedLocations.push(obj);
						});
						return store.dispatch(setLocationsToState(savedLocations));
					}
				})
			}
		});
	}
}

export function fetchGeoLocation(values) {
	console.log('Values', values);
	const url = `${BASE_URL}?address=${values.street},+${values.city},+${values.country}&key=${API_KEY}`;
	const request = axios.get(url).then(
	response => {
		console.log('gahah', response);
		if(!response.data.status || response.data.status === "ZERO_RESULTS"){
			store.dispatch(toggleModalAction());
		}
		console.log('theResponse ---------> ', response);
		let newResponse = response;
		newResponse.street = values.street;
		newResponse.country = values.country;
		newResponse.city = values.city;
		newResponse.lat = response.data.results[0].geometry.location.lat;
		newResponse.lng = response.data.results[0].geometry.location.lng;
		newResponse.formatted_address = response.data.results[0].formatted_address;
		//fetchWeather(response.data.results[0].geometry.location);
		setLocationToMyLocations(newResponse);
		return newResponse
	},
	error => {
		console.log('Fetch geolocation went wrong ', error);
	}
	);
	console.log('request', request);
	return {
		type   : FETCH_GEOLOCATION,
		payload: request
	}
}

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const OPEN_WEATHER_BASE_URL = `http://api.openweathermap.org/data/2.5/forecast`;
export function fetchWeather(values) {
	console.log('response_1', values);
	const url = `${OPEN_WEATHER_BASE_URL}?lat=${values.lat}&lon=${values.lng}&appid=${OPEN_WEATHER_KEY}`;
	const request = axios.get(url).then(
	response => {
		if(response){
			console.log('response_1', response);
			return response;
		}
	},
	error => {
		console.log('Fetch weather went wrong ', error)
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

export function setSingleLocationToState(location) {
	return {
		type   : SET_SINGLE_LOCATION_TO_STATE,
		payload: location
	}
}

export function unsetSingleLocationFromState(location) {
	return {
		type   : UNSET_SINGLE_LOCATION_FROM_STATE,
		payload: location
	}
}

export function setLocationsToState(locations) {
	console.log('Locations1', locations);
	return {
		type   : SET_LOCATIONS_TO_STATE,
		payload: locations
	}
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

export function cleanMyLocations() {
	return {
		type: CLEAN_MY_LOCATIONS
	}
}