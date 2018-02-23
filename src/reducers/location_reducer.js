import {FETCH_GEOLOCATION, CLEAN_STATE} from '../actions/index';

export default function(state = null , action) {
	switch(action.type) {
		case FETCH_GEOLOCATION:
			return action.payload;
		case CLEAN_STATE:
			return state = null;
		default:
			return state;
	}
}