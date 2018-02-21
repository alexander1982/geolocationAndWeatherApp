import {FETCH_GEOLOCATION} from '../actions/index';

export default function(state = {} , action) {
	switch(action.type) {
		case FETCH_GEOLOCATION:
			return action.payload;
		default:
			return state;
	}
}