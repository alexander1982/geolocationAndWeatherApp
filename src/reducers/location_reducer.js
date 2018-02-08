import {FETCH_GEOLOCATION} from '../actions/index';

export default function(state = {} , action) {
	switch(action.type) {
		case FETCH_GEOLOCATION:
			return action.payload.data.results[0].geometry.location;
		default:
			return state;
	}
}