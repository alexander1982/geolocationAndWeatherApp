import {FETCH_GEOLOCATION, CLEAN_STATE} from '../actions/index';

export default function(state = null , action) {
	switch(action.type) {
		case FETCH_GEOLOCATION:
		console.log('action.payload', action.payload);
		if(action.payload !== undefined) {
			return action.payload;
		} else {
			return null;
		}
		case CLEAN_STATE:
			return null;
		default:
			return state;
	}
}