import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = 'AIzaSyDf_5digH9UCB2VteRH4N-UhZRi4HFiakw';

export const FETCH_GEOLOCATION = 'fetch_geoLocation';
export const FETCH_WEATHER = 'fetch_weather';

export function fetchGeoLocation(values) {
	const url = `${BASE_URL}?address=${values.street},+${values.city},+${values.country}&key=${API_KEY}`;
	const request = axios.get(url);

	return {
		type   : FETCH_GEOLOCATION,
		payload: request
	}
}

const OPEN_WEATHER_API_KEY = '50be1af1b17195e72c93943f4badb958';
const OPEN_WEATHER_BASE_URL = `http://api.openweathermap.org/data/2.5/forecast`;
export function fetchWeather(values) {
	const url = `${OPEN_WEATHER_BASE_URL}?lat=${values.lat}&lon=${values.lng}&appid=${OPEN_WEATHER_API_KEY}`;
	const request = axios.get(url);

	return {
		type   : FETCH_WEATHER,
		payload: request
	}
}