import axios from 'axios';
import firebase from 'firebase';
import { store } from '../index';
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
export const SET_LOCATIONS_TO_STATE = 'set_locations_to_state';
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
	let userProfile = {};
	let databaseLocations = null;
	let myLocations = [];
	return firebase.database().ref(`/users/${userId}`).once('value').then(snapshot => {
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
				myLocations.push(theLocation);
			}
			store.dispatch(setLocationsToState(myLocations));
		}
	});
}
export function signInWithGoogle() {
	return firebase.auth().signInWithRedirect(provider).catch(error => {
		console.log('Google sign in error', error);
	})
}

export function Register() {
	let User = firebase.auth().currentUser;
	if(!User) {
		signInWitGoogle().then(() => {
			firebase.auth().currentUser.link(credential);
		})
	}
}

export function signIn() {
	let User = firebase.auth().currentUser;
	if(!User){
		signInWithGoogle().then(() => {
			firebase.auth().currentUser.link(credential);
		})
	} else {
		getUser(User.uid);
	}
}

export function signOut() {
	firebase.auth().signOut().then(() => {
		console.log('Signed out');
		store.dispatch(cleanMyLocations());
		store.dispatch(cleanState());
		store.dispatch(unsetUserFromState());
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
						return store.dispatch(setLocationsToState(null));
					} else {
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
	const url = `${BASE_URL}?address=${values.street},+${values.city},+${values.country}&key=${API_KEY}`;
	const request = axios.get(url).then(
	response => {
		if(!response.data.status || response.data.status === "ZERO_RESULTS"){
			store.dispatch(toggleModalAction());
		}
		let newResponse = response;
		newResponse.street = values.street;
		newResponse.country = values.country;
		newResponse.city = values.city;
		newResponse.lat = response.data.results[0].geometry.location.lat;
		newResponse.lng = response.data.results[0].geometry.location.lng;
		newResponse.formatted_address = response.data.results[0].formatted_address;
		store.dispatch(fetchWeather(response.data.results[0].geometry.location));
		let user = firebase.auth().currentUser;
		if(user) {
			setLocationToMyLocations(newResponse);
		}
		return newResponse
	},
	error => {
		console.log('Fetch geolocation went wrong ', error);
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
	response => {
		if(response){
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

export function setLocationsToState(locations) {
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