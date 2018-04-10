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
		//getMyLocations(User.uid);
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
	let stateUser = {};
	let userProfile = {};
	let databaseLocations = null;
	let myLocations = [];
	let leadsRef = firebase.database().ref(`users/${userId}`);
	leadsRef.on(`value`, (snapshot) => {
		snapshot.forEach((childSnapshot) => {
			stateUser[childSnapshot.key] = childSnapshot.val();
		});

		if(stateUser.name !== undefined){
			userProfile = {
				email  : stateUser.email,
				name   : stateUser.name,
				picture: stateUser.picture
			};
		}
		store.dispatch(setUserToState(userProfile));

		if(stateUser.locations){
			databaseLocations = stateUser.locations;
			for(let key in databaseLocations){
				let theLocation = {};
				theLocation = { [key]: databaseLocations[key] };
				myLocations.push(theLocation);
			}
			console.log('myLocations ', myLocations);
			if(myLocations !== undefined){
				store.dispatch(setLocationsToState(myLocations));
			}
		}
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

export function signInWithGoogle() {
	return firebase.auth().signInWithRedirect(provider).catch(error => {
		console.log('Google sign in error', error);
	})
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
console.log('yes');
	let locationsArray = [];
	let locationsArray_2 = [];
	let locationsArray_3 = [];
	let locationsArray_4 = [];
	let userProfileArray = [];
	let newId = null;
	let foundLocation = null;
	let thirdObj = {};
	let locationObj = {};
	let userId = null;
	let finalObj = {};
	let currentUser = firebase.auth().currentUser;
	if(currentUser){
		userId = currentUser.uid;
		console.log('currentUser', currentUser);
	}
	let leadsRef = firebase.database().ref(`users/${userId}`);
	leadsRef.on(`value`, (snapshot) => {
		if(!snapshot.val().locations){
			console.log('No');
			let makeId = (b) => {
				let s = Math.floor((b.lat + b.lng) * 100000000);
				s.toString();
				console.log('s', s);
				return s;
			};
			newId = makeId(newLocation);
			console.log('newId ', newId);
			firebase.database().ref(`/users/${userId}/locations/${newId}`).set(newLocation);
		} else {
			console.log('snapshot', snapshot.val());
			snapshot.forEach((childSnapshot) => {
				userProfileArray.push(childSnapshot.val());
			});
			let makeId = (b) => {
				let s = Math.floor((b.lat + b.lng) * 100000000);
				s.toString();
				console.log('s', s);
				return s;
			};
			newId = makeId(newLocation);
			console.log('newId ', newId);
			userProfileArray.forEach(location => {
				if(location instanceof Object){
					firebase.database().ref(`users/${userId}/locations`).on(`value`, (snapshot) => {
						snapshot.forEach((childSnapshot) => {
							locationsArray.push(snapshot.val());
							console.log('snapshot.val() ', snapshot.val());
						});
						if(locationsArray.length){
							_.map(locationsArray, (value, akey) => {
								for(let bkey in value){
									locationsArray_2.push(value[bkey]);
								}
								_.uniqBy(locationsArray_2, 'address');
							});
							locationsArray_2.forEach((place) => {
								if(place.lat == newLocation.lat && place.lng == newLocation.lng){
									foundLocation = place;
								} else {
									foundLocation = null;
								}
							});
							if(foundLocation == null){
								locationsArray.map((someValue) => {
									locationObj = someValue;
								});
								console.log('locationObj',  locationObj);
								for(let bkey in locationObj){
									finalObj[bkey] = locationObj[bkey];
									locationsArray_3.push(finalObj);
								}
								locationsArray_3 = _.uniqBy(locationsArray_3, 'address');
								console.log('LocationsArray',  locationsArray_3);
								store.dispatch(setLocationsToState(locationsArray_3));
								firebase.database().ref(`/users/${userId}/locations/${newId}`).set(newLocation);
							}
						} else {
							thirdObj[newId] = newLocation;
							locationsArray_4.push(thirdObj);
							store.dispatch(setLocationsToState(locationsArray_4));
							firebase.database().ref(`/users/${userId}/locations/${newId}`).set(newLocation);
						}
					});

				}
			});
		}
	});
}

export function removeLocationFromMyLocations(params) {
	let userId = null;
	let finalObj = {};
	let locationToDelete = null;
	let currentUser = firebase.auth().currentUser;
	if(currentUser){
		userId = currentUser.uid;
	}
	console.log('userId_1', userId);
	let userProfile = [];
	let databaseLocations = [];
	let startLeadsRef = firebase.database().ref(`users/${userId}`);

		startLeadsRef.on(`value`, (snapshot) => {
			console.log('snapshot.val()', snapshot.val());
			snapshot.forEach((childSnapshot) => {
				userProfile.push(childSnapshot.val());
			});
			console.log('snapshot.val()', userProfile);
			console.log('snapshot.val()', params);
			console.log('userId', userId);
			userProfile.forEach((locationObj) => {
				if(locationObj instanceof Object){
					databaseLocations.push(locationObj);
				}
			});
			console.log('databaseLocations', databaseLocations);
			databaseLocations.forEach(dataLocation => {
				finalObj = dataLocation;
			});
			console.log('finalObj ', finalObj);
			for(let key in finalObj){
				if(params.lat == finalObj[key].lat){
					locationToDelete = key;
					console.log('locationToDelete ', locationToDelete);
					firebase.database().ref(`users/${userId}/locations`).child(locationToDelete).set(null).then(() => {
						getMyLocations(userId);
					});
				}
			}
		});
}

export function getMyLocations(id) {
	let myLocations = [];
	let leadsRef = firebase.database().ref(`users/${id}/locations`);
	leadsRef.on(`value`, (snapshot) => {
		snapshot.forEach((childSnapshot) => {
			let the_key = childSnapshot.key;
			let theLocation = {};
			theLocation[the_key] = childSnapshot.val();
			myLocations.push(theLocation)
		});
		store.dispatch(setLocationsToState(myLocations));
		console.log('myLocations ', myLocations);
	});
}

export function setLocation(location) {
	let locationData = {
		address: location.injected_data.formatted_address,
		city   : location.injected_data.city,
		country: location.injected_data.country,
		street : location.injected_data.street,
		lat    : location.injected_data.geometry.lat,
		lng    : location.injected_data.geometry.lng
	};
	console.log('locationData', locationData);
	setLocationToMyLocations(locationData);
}

export function fetchGeoLocation(values) {
	const url = `${BASE_URL}?address=${values.street},+${values.city},+${values.country}&key=${API_KEY}`;
	const request = axios.get(url).then(
	response => {
		console.log('gahah', response);
		if(!response.data.status || response.data.status === "ZERO_RESULTS"){
			store.dispatch(toggleModalAction());
		} else if(response.data.status == "OK"){
			let formattedAddress = {
				injected_data: {
					street           : values.street,
					city             : values.city,
					country          : values.country,
					geometry         : {
						lat: response.data.results[0].geometry.location.lat,
						lng: response.data.results[0].geometry.location.lng
					},
					formatted_address: response.data.results[0].formatted_address
				}
			};
			console.log('formattedAddress', formattedAddress);
			setLocation(formattedAddress);
		}
		return response
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
	const url = `${OPEN_WEATHER_BASE_URL}?lat=${values.lat}&lon=${values.lng}&appid=${OPEN_WEATHER_KEY}`;
	const request = axios.get(url).then(
	response => response,
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